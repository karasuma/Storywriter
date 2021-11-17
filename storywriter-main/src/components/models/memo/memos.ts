import { IUniqueObject, Utils } from "../utils";

export class Memos implements IUniqueObject {
    public id: string = Utils.getUniqueId();
    public memoList: MemoItem[] = new Array<MemoItem>();

    public addMemo(name: string = "", color: string = "transparent"): void {
        const newMemo = new MemoItem(name, this);
        newMemo.color = color;
        this.memoList.push(newMemo);
    }

    public removeMemo(id: string): void {
        const idx = this.memoList.findIndex(x => x.id == id);
        if(idx >= 0) {
            this.memoList.splice(idx, 1);
        }
    }

    public clear(): void {
        this.memoList.splice(0);
    }
}

export class MemoItem implements IUniqueObject {
    public id: string = Utils.getUniqueId();
    public color: string = "transparent";
    public name: string = "";
    public text: string = "";
    private parent: Memos;

    constructor(name: string, parent: Memos) {
        this.name = name;
        this.parent = parent;
    }

    public deleteMe(): void {
        this.parent.removeMemo(this.id);
    }
}