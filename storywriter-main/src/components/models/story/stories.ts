import { IUniqueObject, Utils } from "../utils";
import { StoryData } from "./story-data";

export class Stories implements IUniqueObject {
    public readonly id: string = Utils.getUniqueId();
    public content: StoryData = new StoryData();
    public children: Stories[] = new Array<Stories>();
    public isEditing: boolean = false;
    public isExpanding: boolean = false;
    public parent: Stories | null = null;
    public readonly root: Stories;
    
    private currentDepth: number = 0;
    private dirMode: boolean = false;

    constructor(
        createAsDir: boolean,
        caption: string = "x",
        depth: number = 0,
        root: Stories | null = null) {
        this.dirMode = createAsDir;
        this.content.caption = caption;
        this.currentDepth = depth;
        if(depth > 0 && root === null) {
            let msg = "[constructor("+this.content.caption+") in Stories] ";
            msg += "Argument Error: Non-root story received null.";
            throw Error(msg);
        }
        this.root = (depth > 0 ? root as Stories : this);
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
        if(this.root.children.length == 0) return -1;
        return Stories.flatStories(this.root.children)
            .map((x: Stories) => x.content.time)
            .reduce((acc: number, curr: number) => acc > curr ? acc : curr);
    }

    appendNewStory(createAsDir: boolean, caption: string = "New story"): Stories {
        const newDepth = this.currentDepth + 1;
        const newStory = new Stories(createAsDir, caption, newDepth, this.root);
        newStory.content.time = createAsDir ? -1 : this.getLastChildTimelineIndex() + 1;
        return this.appendStory(newStory);
    }

    appendStory(story: Stories): Stories {
        story.parent = this;
        this.children.push(story);
        return story;
    }

    isDirectory(): boolean {
        return this.dirMode;
    }

    editing(mode: boolean) {
        if(mode) {
            Stories.flatStories(this.root.children).forEach((x: Stories) => x.isEditing = false);
        }
        this.isEditing = mode;
    }

    getEditingChildren(): Stories | undefined {
        return Stories.flatStories(this.root.children)
            .find((x: Stories) => x.isEditing);
    }

    hasEditingChildren(): boolean {
        return this.getEditingChildren() !== undefined;
    }
}
