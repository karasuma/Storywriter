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

    public getLoreIndex(lore: StoryItem) {
        return this.lores.indexOf(lore);
    }

    public getLoreIndexFromID(id: string) {
        return this.getLoreIndex(this.getLoreItem(id));
    }

    public getLoreItem(id: string) {
        return this.lores.find((x: StoryItem) => x.id == id) as StoryItem;
    }

    public moveLore(id: string, isUp: boolean) {
        const targetIdx = this.getLoreIndexFromID(id);

        if(isUp && targetIdx > 0) {
            this.swapLore(targetIdx, targetIdx - 1);
        } else if(targetIdx < this.lores.length - 1) {
            this.swapLore(targetIdx, targetIdx + 1);
        }
    }

    private swapLore(idx1: number, idx2: number) {
        let temp = this.lores[idx1];
        this.lores[idx1] = this.lores[idx2];
        this.lores[idx2] = temp;
    }
}
