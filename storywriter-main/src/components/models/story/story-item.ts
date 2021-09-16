import { IUniqueObject, Utils } from "../utils";

export class StoryItem implements IUniqueObject {
    public readonly id: string = Utils.getUniqueId();
    public title: string = "";
    public color: string = "#383838";
    public stories: StoryContent[] = new Array<StoryContent>();

    public addStory() {
        this.stories.push(new StoryContent());
    }

    public removeStory(index: number) {
        this.stories.splice(index, 1);
    }
}

class StoryContent {
    public text: string = "";
}