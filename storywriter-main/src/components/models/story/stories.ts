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

    static flatStories(stories: Array<Stories>): Array<Stories> {
        let flatStories = new Array<Stories>();
        stories.forEach((x: Stories) => {
            flatStories.push(x);
            flatStories = flatStories.concat(Stories.flatStories(x.children));
        });
        return flatStories;
    }

    static findStoryFromId(stories: Array<Stories>, id: string): Stories | undefined {
        return Stories.flatStories(stories).find((x: Stories) => x.id === id);
    }

    static removeTargetStory(stories: Array<Stories>, id: string): boolean {
        const index = stories.findIndex((x: Stories) => x.id === id);
        if(index >= 0) {
            stories.splice(index, 1);
            return true;
        }

        for(const story of stories) {
            const removed = Stories.removeTargetStory(story.children, id);
            if(removed) {
                return true;
            }
        }

        return false;
    }

    getLastChildTimelineIndex(): number {
        const flatten = Stories.flatStories(this.children);
        if(flatten.length == 0) return -1;
        return flatten[flatten.length - 1].content.time;
    }

    appendNewStory(createAsDir: boolean, caption: string = "New story", tlIndex: number = 0): Stories {
        const newDepth = createAsDir ? this.currentDepth + 1 : this.currentDepth;
        const newStory = new Stories(createAsDir, newDepth);
        newStory.content.caption = caption;
        newStory.content.time = createAsDir ? -1 : tlIndex;
        return this.appendStory(newStory);
    }

    appendStory(story: Stories): Stories {
        this.children.push(story);
        return story;
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
