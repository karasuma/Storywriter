import { StoryItem } from './story-item';

export class StoryData {
    public caption: string = "";
    public description: string = "";
    public lores: StoryItem[] = new Array<StoryItem>();

    public addLore() {
        this.lores.push(new StoryItem());
    }

    public removeLore(id: string) {
        this.lores = this.lores.filter((x: StoryItem) => x.id !== id);
    }
}
