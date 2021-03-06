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
import DefaultStory from './models/default-story';
import { ContentCompressor } from './models/savedata/content-compressor';
import OperationHistory from './models/operation-history';

export class StoryWriterViewModel {
    public hierarchy: Stories = new Stories(true);
    public dictionary: Dictionary = new Dictionary();
    public actors: Actors = new Actors();
    public worlds: Worlds = new Worlds();
    public memos: Memos = new Memos();
    public menuIndex = 0;

    public setting: StoryPreference;
    public message: SystemMessage = new SystemMessage();
    public editing = false;

    public modalShowing = false;
    public textEdting = false;

    public history: OperationHistory;

    static readonly CREATE_BLANK: string = "CREATE_BLANK";

    constructor(path = "") {
        this.history = new OperationHistory();
        if(path === StoryWriterViewModel.CREATE_BLANK) {
            this.setting = new StoryPreference("");
            return;
        }
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
                    //this.history.Clear(this);
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
        //this.history.Clear(this);
        this.editing = true;
    }

    public clear(): void {
        this.hierarchy.clear();
        this.dictionary.clear();
        this.dictionary.clear();
        this.worlds.clear();
        this.memos.clear();
        this.menuIndex = 0;
    }
}

export class StoryWriterViewModelSample extends StoryWriterViewModel {
    constructor() {
        //super("J:\\Temporary\\savedata.swd");
        super("");
        
        // Sample story
        const editing = this.hierarchy.appendNewStory(false, "????????????");
        editing.isEditing = true;
        const dir = this.hierarchy.appendNewStory(true, "????????????1");
        dir.appendNewStory(false, "New awesome story 01 but this is not my product");
        dir.appendNewStory(false, "????????????");
        this.hierarchy.appendNewStory(false, "??????????????????????????????");
        
        // Sample dictionary
        this.dictionary.appendNewWord("?????????");
        this.dictionary.appendNewWord("Other word");
        this.dictionary.words[1].editing = true;
        this.dictionary.appendNewWord("?????? No.X");

        // Sample actors
        this.actors.createNewActor("????????????");
        this.actors.createNewActor("Toooooooooooooooo looooooong naaaaaaaaaaame");
        this.actors.actors[1].editing = true;
        this.actors.createNewActor("???");

        // Sample worlds
        this.worlds.addWorld("????????????");
        this.worlds.worldGroups[0].expanding = true;
        this.worlds.worldGroups[0].addCountry("???????????????");
        this.worlds.worldGroups[0].addCountry("????????????");
        this.worlds.worldGroups[0].countries[1].editing = true;
        this.worlds.addWorld("????????????");
        this.worlds.addWorld("????????????");

        // Sample memos
        this.memos.addMemo("???????????????");
        this.memos.memoList[0].text = "I thought what I'd do was,\nI'd pretend I was one of those deaf-mutes."
        this.memos.addMemo("?????????");
        this.memos.addMemo("Toooooooooooooooo looooooong naaaaaaaaaaame aaaaaa");
    }
}