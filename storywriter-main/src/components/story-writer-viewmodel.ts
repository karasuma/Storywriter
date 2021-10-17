import { StoryPreference } from './models/story-preference';
import { Stories } from './models/story/stories';
import { Dictionary } from './models/dictionary/dictionary';

export class StoryWrtiterViewModel {
    public hierarchy: Stories = new Stories(false);
    public dictionary: Dictionary = new Dictionary();
    public setting: StoryPreference;
    constructor(path: string) {
        this.setting = new StoryPreference(path);
    }
}

export class StoryWrtiterViewModelSample extends StoryWrtiterViewModel {
    constructor() {
        super("J:\\Temp\\sw");
        
        // Sample story
        const root = new Stories(true);
        const editing = root.appendNewStory(false, "サンプル");
        editing.isEditing = true;
        const dir = root.appendNewStory(true, "グループ1");
        dir.appendNewStory(false, "New awesome story 01 but this is not my product");
        dir.appendNewStory(false, "たいとる");
        root.appendNewStory(false, "邪知暴虐のゲネイオス");
        this.hierarchy = root;
        
        // Sample dictionary
        this.dictionary.appendNewWord("用語１");
        this.dictionary.appendNewWord("Other word");
        this.dictionary.words[1].editing = true;
        this.dictionary.appendNewWord("用語 No.X");
    }
}