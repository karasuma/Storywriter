import { StoryPreference } from './models/story-preference';
import { Stories } from './models/story/stories';
import { Dictionary } from './models/dictionary/dictionary';
import { Actors } from './models/actor/actors';
import { Worlds } from './models/world/worlds';
import { Memos } from './models/memo/memos';
import { SystemMessage } from './models/system-message';
import { Defs } from './models/defs';
import { FileAccessor } from './models/savedata/file-accessor';
import { JsonConverter } from './models/savedata/json-converter';
import { ViewmodelUpdater } from './models/savedata/vm-udpater';
import { ISimpleFunction, Utils } from './models/utils';
import Logger from './models/logger';
import { Dialogs } from './models/savedata/dialogs';

export class StoryWrtiterViewModel {
    public hierarchy: Stories = new Stories(true);
    public dictionary: Dictionary = new Dictionary();
    public actors: Actors = new Actors();
    public worlds: Worlds = new Worlds();
    public memos: Memos = new Memos();

    public setting: StoryPreference;
    public message: SystemMessage = new SystemMessage();
    public editing = false;

    constructor(path = "") {
        this.setting = new StoryPreference(path);
        this.setting.load();
    }

    public loadStory(path: string): void {
        this.message.changeMessage(
            `Story loading from ${path} ...`,
            SystemMessage.MessageType.Warning
        );
        FileAccessor.Load(path)
            .then(status => {
                if(status.isSuccess) {
                    const newvm = JsonConverter.fromJsonString(status.content);
                    this.clear();
                    ViewmodelUpdater.Update(this, newvm);
                    this.setting.path = path;
                    this.editing = true;

                    const time = Utils.getSimpleTimeStamp();
                    this.message.changeMessage(`Load completed! [${time}]`);
                    Logger.write("Story load event", `Load succeed from ${path}`, Logger.LoggingStatus.Info);
                } else {
                    this.message.changeMessage(status.content, SystemMessage.MessageType.Alert);
                    Logger.write("Story load error", `${status.content}\npath: ${path}`, Logger.LoggingStatus.Err);
                }
            });
    }

    public saveStory(callback: ISimpleFunction | null = null): void {
        if(!this.editing) return;
        if(this.setting.path.length == 0) {
            Dialogs.openSaveWindow(this, () => this.saveStory());
            return;
        }

        const vmJson = JsonConverter.toJsonString(this);
        this.message.changeMessage("Saving...", SystemMessage.MessageType.Warning);
        FileAccessor.Save(this.setting.path, vmJson)
            .then(result => {
                const time = Utils.getSimpleTimeStamp();
                if(result.isSuccess) {
                    this.message.changeMessage(`${result.content} [${time}]`);
                    Logger.write("Story save event", `Save succeed to ${this.setting.path}`, Logger.LoggingStatus.Info);
                    if(callback !== null) {
                        callback();
                    }
                    return;
                }
                this.message.changeMessage(`Save failed... (${result.content}) [${time}]`, SystemMessage.MessageType.Alert);
                Logger.write("Story save error", result.content, Logger.LoggingStatus.Err);
            });
    }
    
    public setDefaultStories(): void {
        // Hierarchy
        this.hierarchy.clear();
        const h_start = this.hierarchy.appendNewStory(false, "ようこそ");
        h_start.content.description = 
            "Storywriterへようこそ！\n\n" +
            "ここはストーリー編集画面です。\n" +
            "基本的にはメインストーリーやサブストーリーなど、ゲームの流れを創造する場所として" +
            "作られました。が、使い方は自由です！好きにしてくださいな！";
        h_start.content.addLore();
        h_start.content.lores[0].title = "タイムライン画面について";
        h_start.content.lores[0].addStory();
        h_start.content.lores[0].stories[0].text = 
            "タイムライン画面では時系列の確認ができます。\n" +
            "お話のタイトルをクリックするとそのストーリーを編集することができます。";
        h_start.editing(true);
        const dir = this.hierarchy.appendNewStory(true, "サブストーリー");
        const h_sample = dir.appendNewStory(false, "隣町のお話");
        h_sample.content.description =
            "メインストーリー２章１話終了後に解放される\n" +
            "主人公と女魔導士が肉体関係を持ったことを幼馴染が知って（勘違い）闇落ちしたのを" +
            "助けに行くストーリー（ギャグ）";
        h_sample.content.color = Defs.definedLightColors[3];
        h_sample.content.addLore();
        h_sample.content.lores[0].title = "プロローグ";
        h_sample.content.lores[0].addStory();
        h_sample.content.lores[0].stories[0].text = "幼馴染が行方不明";
        h_sample.content.lores[0].addStory();
        h_sample.content.lores[0].stories[1].text = "淫魔の森へ向かう";
        h_sample.content.addLore();
        h_sample.content.lores[1].title = "戦闘";
        h_sample.content.lores[1].color = Defs.definedDarkColors[1];
        h_sample.content.lores[1].addStory();
        h_sample.content.lores[1].stories[0].text = 
            "森で魔物に囲まれる\n" +
            "・ザコゴブリン40体\n・斧ゴブリン8体";
        h_sample.content.lores[1].addStory();
        h_sample.content.lores[1].stories[1].text =
            "めっちゃ強そうな敵が出る\n" +
            "（めっちゃ弱い）";
        h_sample.content.addLore();
        h_sample.content.lores[2].title = "エピローグ";
        h_sample.content.lores[2].addStory();
        h_sample.content.lores[2].stories[0].text = "めっちゃ頑張って誤解を解く";

        // Dictionary
        this.dictionary.clear();
        this.dictionary.appendNewWord("魔法");
        this.dictionary.words[0].description =
            "なんかこう、ワァーってやると出てくるすごいやつ\n" +
            "すごい人が使うともっとこう、なんかワァァーーってなってすごい";
        this.dictionary.appendNewWord("結婚");
        this.dictionary.words[1].description =
            "（婚姻適齢）　　第７３１条：男は１８歳に、女は１６歳にならなければ婚姻はできない。\n" +
            "（近親婚の禁止）第７３４条：直系血族又は三親等内の傍系血族間では婚姻できない（養子を除く）。\n" +
            "（成年擬制）　　第７５３条：未成年者が婚姻をしたときは、もう成年として扱う。\n";
        
        // Actors
        this.actors.clear();
        this.actors.createNewActor("主人公");
        this.actors.actors[0].introduce =
            "ゲネイオン帝国領ジョーシティの男の子。\n" +
            "剣術に長けており、人望も厚いため沢山の町人に慕われている。\n" +
            "町の初等学校で少し問題を起こしてしまい、町長に社会奉仕として魔王討伐を言いつけられる。\n";
        this.actors.actors[0].detail =
            "特殊スキル：スィーティ・プディング\n" +
            "大好物の甘味を食べることでHP上限の25%を回復し、攻撃力を攻撃力の20%増加させる。";
        this.actors.createNewActor("女魔導士");
        this.actors.actors[1].introduce = 
            "ゲネイオン帝国ピグニ魔術学校の生徒。\n" +
            "今年で８浪目。大先生に「次浪人したらおまえあれだぞ、あの、" +
            "実験ゴブリン達の苗床にするからな」といわれ焦りに焦り、テンパった結果卒論テーマを" +
            "魔王の生態にしてしまい魔王城へ向かう羽目になったあわれな魔導士。\n" +
            "主人公とは旅の途中で出会い、旅の目的とラノベの趣味が一緒だったことから" +
            "共に旅をすることになる。";
        this.actors.actors[1].detail =
            "特殊スキル：幽玄恢弘\n" +
            "相手にLSD幻覚さながらの精神世界を見せつけ、混乱状態にする。\n" +
            "精神が弱い敵は狂気に陥り、もう二度と普通の生活を送ることはできない。";
        this.actors.createNewActor("幼馴染");
        this.actors.actors[2].introduce = 
            "ゲネイオン帝国領ジョーシティの女の子。\n" +
            "主人公の隣の家に住んでおり、主人公のことを友達以上恋人未満に慕っている。\n" +
            "内気な主人公を見ているうちに、「この子は私が守らなきゃ・・・」という気持ちが" +
            "強くなってしまい、最近では独占欲に拍車が掛かり、いわゆる「ヤンデレ」と呼ばれる" +
            "存在になっている。\n";
        this.actors.actors[2].detail =
            "特殊スキル：「・・・なんで？」\n" +
            "主人公の攻撃力を増加させる。増加量は主人公の被ダメージ量に比例する。\n" +
            "主人公の残りHPが低いほど大きな攻撃力を得られるが、HPの20%以下の状態で" +
            "使うと戦闘後になんですぐに助けを呼ばなかったのかを小一時間強ほど問い詰める。";

        // Worlds
        this.worlds.clear();
        this.worlds.addWorld("ゲネイオン帝国");
        this.worlds.worldGroups[0].addCountry("ゲネイオン帝国");
        this.worlds.worldGroups[0].countries[0].description =
            "世界最大の帝国。\n" +
            "現在魔王の侵略の危機に瀕している。";
        this.worlds.worldGroups[0].addCountry("ジョーシティ");
        this.worlds.worldGroups[0].countries[1].description =
            "ゲネイオン帝国領の小さな町。\n" +
            "祭事に使う絹や麻を栽培している。最近一部の植物から成分を抽出することで" +
            "精神作用の強いお薬が作れるということが帝国にバレ、栽培禁止のお触れが出た。";
        this.worlds.worldGroups[0].addCountry("ピグニ魔術学校");
        this.worlds.worldGroups[0].countries[2].description =
            "ゲネイオン帝国の東端にある魔術学校。\n" +
            "帝国の将来を背負う将来有望な魔法使い見習いが沢山在籍している。\n" +
            "去年酒精の研究をしていたチームがアルコール度数9500という異常な液体を作り、" +
            "その蒸気で研究棟１棟の全生物を泥酔させるという事件が発生してからこの学校では" +
            "酒類の取り扱いについては厳しく制限されている。";
        this.worlds.addWorld("魔王城");
        this.worlds.worldGroups[1].addCountry("玉座");
        this.worlds.worldGroups[1].countries[0].description =
            "魔王が座ってる場所。あの椅子にいつも座っている魔王は間違いなく痔持ち。";
        
        // Memos
        this.memos.clear();
        this.memos.addMemo("参考資料", Defs.definedDarkColors[4]);
        this.memos.memoList[0].text = "https://ja.wikipedia.org";
        this.memos.addMemo("ソフトを作った人");
        this.memos.memoList[1].text = "@yakumo_crow (twitter)";
    }

    public clear(): void {
        this.hierarchy.clear();
        this.dictionary.clear();
        this.dictionary.clear();
        this.worlds.clear();
        this.memos.clear();
    }
}

export class StoryWrtiterViewModelSample extends StoryWrtiterViewModel {
    constructor() {
        //super("J:\\Temporary\\savedata.swd");
        super("");
        
        // Sample story
        const editing = this.hierarchy.appendNewStory(false, "サンプル");
        editing.isEditing = true;
        const dir = this.hierarchy.appendNewStory(true, "グループ1");
        dir.appendNewStory(false, "New awesome story 01 but this is not my product");
        dir.appendNewStory(false, "たいとる");
        this.hierarchy.appendNewStory(false, "邪知暴虐のゲネイオン");
        
        // Sample dictionary
        this.dictionary.appendNewWord("用語１");
        this.dictionary.appendNewWord("Other word");
        this.dictionary.words[1].editing = true;
        this.dictionary.appendNewWord("用語 No.X");

        // Sample actors
        this.actors.createNewActor("キャラ１");
        this.actors.createNewActor("Toooooooooooooooo looooooong naaaaaaaaaaame");
        this.actors.actors[1].editing = true;
        this.actors.createNewActor("顎");

        // Sample worlds
        this.worlds.addWorld("妖怪の山");
        this.worlds.worldGroups[0].expanding = true;
        this.worlds.worldGroups[0].addCountry("大蝦蟇の池");
        this.worlds.worldGroups[0].addCountry("天狗の里");
        this.worlds.worldGroups[0].countries[1].editing = true;
        this.worlds.addWorld("人間の里");
        this.worlds.addWorld("マヨヒガ");

        // Sample memos
        this.memos.addMemo("アイデア１");
        this.memos.memoList[0].text = "I thought what I'd do was,\nI'd pretend I was one of those deaf-mutes."
        this.memos.addMemo("世界観");
        this.memos.addMemo("Toooooooooooooooo looooooong naaaaaaaaaaame aaaaaa");
    }
}