import { IUniqueObject, Utils } from "../utils";
import { StoryData } from "./story-data";

export class Stories implements IUniqueObject {
    public readonly id: string = Utils.getUniqueId();
    public content: StoryData = new StoryData();
    public children: Stories[] = new Array<Stories>();
    public isEditing: boolean = false;
    
    private currentDepth: number = 0;
    private dirMode: boolean = false;

    constructor(createAsDir: boolean, depth: number = 0){
        this.dirMode = createAsDir;
        this.currentDepth = depth;
    }

    appendNewStory(createAsDir: boolean) {
        const newDepth = createAsDir ? this.currentDepth + 1 : this.currentDepth;
        const newStory = new Stories(createAsDir, newDepth);
        newStory.content.caption = "Your new awesome story";
        this.appendStory(newStory);
    }

    appendStory(newStory: Stories) {
        this.children.push(newStory);
    }

    isDirectory(): boolean {
        return this.dirMode;
    }

    editing(mode: boolean) {
        this.isEditing = mode;
    }

    disableEditingChildren(disableSelf: boolean = false) {
        for(const child of this.children) {
            child.editing(false);
            child.disableEditingChildren(true);
        }
        if(disableSelf) {
            this.editing(false);
        }
    }

    getEditingChildren(): Stories | undefined {
        if(this.isEditing) {
            return this;
        }
        return this.children.find((x: Stories) => typeof x.getEditingChildren() !== 'undefined');
    }

    hasEditingChildren(): boolean {
        if(this.isEditing) {
            return true;
        }
        return this.children.some((x: Stories) => x.hasEditingChildren());
    }
}
