import { IUniqueObject, Utils } from "../utils";

export class StoryItem implements IUniqueObject {
    public id: string = Utils.getUniqueId();
    public title = "";
    public color = "#383838";
    public stories: StoryContent[] = new Array<StoryContent>();

    public addStory() {
        this.stories.push(new StoryContent());
    }

    public removeStory(index: number) {
        this.stories.splice(index, 1);
    }
}

export class StoryContent implements IUniqueObject {
    public id: string = Utils.getUniqueId();
    public text = "";
}