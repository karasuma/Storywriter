import { Word } from "./word";

export class Dictionary {
    public words: Word[] = new Array<Word>();

    public appendNewWord(caption = "") {
        const newWord = new Word();
        newWord.caption = caption;
        this.words.push(newWord);
    }
    public removeWord(id: string) {
        const targetIndex = this.words.findIndex((x: Word) => x.id == id);
        if(targetIndex >= 0) {
            this.words.splice(targetIndex, 1);
        }
    }

    public changeEditingWord(id: string) {
        const target = this.words.find((x: Word) => x.id == id);
        if(target !== undefined) {
            this.words.forEach((x: Word) => x.editing = false);
            target.editing = true;
        }
    }

    public clear(): void {
        this.words.forEach(x => x.resources.splice(0));
        this.words.splice(0);
    }
}