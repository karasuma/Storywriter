import { isFunctionType } from "@vue/compiler-core";
import { IUniqueObject, Utils } from "../utils";
import { StoryData } from "./story-data";

export class Stories implements IUniqueObject {
    public id: string = Utils.getUniqueId();
    public content: StoryData = new StoryData();
    public children: Stories[] = new Array<Stories>();
    public isEditing = false;
    public isExpanding = false;
    public parent: Stories | null = null;
    public dirMode = false;
    public readonly root: Stories;
    
    public currentDepth = 0;

    constructor(
        createAsDir: boolean,
        caption = "x",
        depth = 0,
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

    static setAllTimes(root: Stories): void {
        const flatten = Stories.flatStories(root.children);
        let time = 1;
        flatten.forEach(x => {
            if(x.isDirectory()) {
                x.content.time = -1;
            } else {
                x.content.time = time++;
            }
        });
    }

    getLastChildTimelineIndex(): number {
        if(this.root.children.length == 0) return -1;
        return Stories.flatStories(this.root.children)
            .map((x: Stories) => x.content.time)
            .reduce((acc: number, curr: number) => acc > curr ? acc : curr);
    }

    appendNewStory(createAsDir: boolean, caption = "New story"): Stories {
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

    clear(): void {
        this.content.lores.forEach(l => l.stories.splice(0));
        this.content.lores.splice(0);
        this.children.forEach(x => x.clear());
        this.children.splice(0);
    }

    moveStory(id: string, isUp: boolean): void {
        const flatten = Stories.flatStories(this.root.children);
        const currDirs = flatten.find((x: Stories) => x.id == id)!.parent!.children;
        const currIdx = currDirs.findIndex((x: Stories) => x.id == id);
        if(isUp && currIdx > 0) {
            this.swapStory(id, currDirs[currIdx - 1].id);
        }
        if(!isUp && currIdx < currDirs.length - 1) {
            this.swapStory(id, currDirs[currIdx + 1].id);
        }
    }

    swapStory(id1: string, id2: string): void {
        const flatten = Stories.flatStories(this.root.children);
        const left = flatten.findIndex((x: Stories) => x.id == id1);
        const right = flatten.findIndex((x: Stories) => x.id == id2);
        if(left < 0 || right < 0) {
            return;
        }

        const tContent = flatten[left].content;
        const tChildren = flatten[left].children;
        const tEditing = flatten[left].isEditing;
        const tExpanding = flatten[left].isExpanding;
        const tDirmode = flatten[left].dirMode;
        
        flatten[left].content = flatten[right].content;
        flatten[left].children = flatten[right].children;
        flatten[left].isEditing = flatten[right].isEditing;
        flatten[left].isExpanding = flatten[right].isExpanding;
        flatten[left].dirMode = flatten[right].dirMode;

        flatten[right].content = tContent;
        flatten[right].children = tChildren;
        flatten[right].isEditing = tEditing;
        flatten[right].isExpanding = tExpanding;
        flatten[right].dirMode = tDirmode;
        
        Stories.setAllTimes(this.root);
    }
}
