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
import DefaultStory from './models/default-story';
import { ContentCompressor } from './models/savedata/content-compressor';

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

    public loadDefaultStories(): void {
        this.clear();
        const decompressed = ContentCompressor.unpack(DefaultStory.defaultStory);
        const newvm = JsonConverter.fromJsonString(decompressed.replace(FileAccessor.prefix, ""));
        ViewmodelUpdater.Update(this, newvm);
        this.editing = true;
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