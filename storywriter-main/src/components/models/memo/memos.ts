import { IUniqueObject, Utils } from "../utils";

export class Memos implements IUniqueObject {
    public id: string = Utils.getUniqueId();
    public memoList: MemoItem[] = new Array<MemoItem>();

    public addMemo(name = "", color = "transparent"): void {
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

    public moveMemo(id: string, isUp: boolean): void {
        const target = this.memoList.find(x => x.id == id) as MemoItem;
        const idx = this.memoList.findIndex(x => x.id == id);

        if(isUp && idx > 0) {
            this.swapMemo(target, this.memoList[idx - 1]);
        } else if(!isUp && idx < this.memoList.length - 1) {
            this.swapMemo(target, this.memoList[idx + 1]);
        }
    }

    public swapMemo(left: MemoItem, right: MemoItem): void {
        const tId = left!.id;
        const tColor = left!.color;
        const tName = left!.name;
        const tText = left!.text;

        left!.id = right!.id;
        left!.color = right!.color;
        left!.name = right!.name;
        left!.text = right!.text;

        right!.id = tId;
        right!.color = tColor;
        right!.name = tName;
        right!.text = tText;
    }

    public clear(): void {
        this.memoList.splice(0);
    }
}

export class MemoItem implements IUniqueObject {
    public id: string = Utils.getUniqueId();
    public color = "transparent";
    public name = "";
    public text = "";
    public parent: Memos;

    constructor(name: string, parent: Memos) {
        this.name = name;
        this.parent = parent;
    }

    public deleteMe(): void {
        this.parent.removeMemo(this.id);
    }
}