import { StoryPreference } from './models/story-preference';
import { Stories } from './models/story/stories';
import { Dictionary } from './models/dictionary/dictionary';
import { Actors } from './models/actor/actors';
import { Worlds } from './models/world/worlds';
import { Memos } from './models/memo/memos';

export class StoryWrtiterViewModel {
    public hierarchy: Stories = new Stories(true);
    public dictionary: Dictionary = new Dictionary();
    public actors: Actors = new Actors();
    public worlds: Worlds = new Worlds();
    public memos: Memos = new Memos();
    public setting: StoryPreference;
    constructor(path: string) {
        this.setting = new StoryPreference(path);
    }
}

export class StoryWrtiterViewModelSample extends StoryWrtiterViewModel {
    constructor() {
        super("J:\\Temp\\sw");
        
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