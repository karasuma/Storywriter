import { StoryWriterViewModel } from "../story-writer-viewmodel";
import { ContentCompressor } from "./savedata/content-compressor";
import { JsonConverter } from "./savedata/json-converter";
import { ViewmodelUpdater } from "./savedata/vm-udpater";
import { Enumerable } from "./utils";
import * as Diff from 'diff';
import { FileAccessor } from "./savedata/file-accessor";

export default class OperationHistory {
    public initial = "";
    public history: string[] = new Array<string>();
    public currentPosition = -1;
    public headPosition = -1;

    constructor(initial?: StoryWriterViewModel) {
        this.Clear(initial);
    }

    private initialJson(): string {
        return this.initial;
    }

    public Clear(initial?: StoryWriterViewModel): void {
        this.history.splice(0);
        this.currentPosition = -1;
        this.headPosition = -1;

        if(initial !== undefined) {
            this.initial = JsonConverter.toJsonString(initial);
        }
    }

    public Pickup(index: number): StoryWriterViewModel {
        // Rollback/Rollforward
        let json = this.initialJson();
        if(index >= 0) {
            Enumerable.Range(index + 1, 0)
                .map(i => JSON.parse(ContentCompressor.unpack(this.history[i])) as OperationObject)
                .map(dao => {
                    const obj = new OperationObject();
                    obj.HeadIndex = dao.HeadIndex;
                    obj.Added = dao.Added;
                    obj.Removed = dao.Removed;
                    return obj;
                })
                .forEach(obj => {
                    const headStr = json.substring(0, obj.HeadIndex).trimEnd();
                    const backStr = json.substring(obj.HeadIndex + obj.Removed.length).trimEnd();
                    const last = (s: string): string => s[s.length - 1];
                    const appendStr = (backStr.length > 0 && last(headStr) === "}" || last(headStr) === "]") ? ",\n" : "";
                    json = headStr + appendStr + obj.Added + backStr;
                    if(last(json.trimEnd()) !== "}") json += "}";
                });
        }
        try {
            return JsonConverter.fromJsonString(json);
        } catch(err) {
            FileAccessor.SaveSimple("L:\\Temporary\\err.txt", json);
            throw err;
        }
    }

    public Update(currentVm: StoryWriterViewModel): void {
        return; // Operation history has omitted...
        const currentJson = JsonConverter.toJsonString(currentVm);
        const diff = new OperationObject();

        // Don't update if the current data is the same as the previous data
        if(this.currentPosition >= 0) {
            const previous = JsonConverter.toJsonString(this.Pickup(this.currentPosition));
            diff.Create(previous, currentJson);
            if(diff.Unchagned()) return;
        } else {
            diff.Create(this.initialJson(), currentJson);
        }

        // Update history when the position moved back
        if(this.history.length > 0 && this.currentPosition < this.headPosition) {
            this.history.splice(this.currentPosition + 1);
        }

        // Add new history
        this.history.push(ContentCompressor.pack(JSON.stringify(diff)));
        this.currentPosition++;
        this.headPosition = this.currentPosition;
    }

    public Restore(targetVm: StoryWriterViewModel, index: number): void {
        ViewmodelUpdater.Update(targetVm, this.Pickup(index));
    }

    public Undo(currentVm: StoryWriterViewModel): void {
        if(this.currentPosition < 0) return;
        this.currentPosition--;
        this.Restore(currentVm, this.currentPosition);
    }

    public Redo(currentVm: StoryWriterViewModel): void {
        if(this.headPosition < 0 || this.currentPosition === this.headPosition) return;
        this.currentPosition++;
        this.Restore(currentVm, this.currentPosition);
    }
}

class OperationObject {
    public HeadIndex = 0;
    public Added = "";
    public Removed = "";

    constructor(prev?: string, next?: string) {
        if(prev === undefined && next === undefined) return;
        this.Create(prev === undefined ? "" : prev!, next === undefined ? "" : next!);
    }

    public ToString(): string {
        return `OperationObject: ${this.HeadIndex}, (+ ${this.Added}), (- ${this.Removed})`;
    }

    public Unchagned(): boolean {
        return (this.Added.length + this.Removed.length) === 0;
    }

    public Create(prev: string, next: string): void {
        const diffs = Diff.diffJson(prev, next);
        const prevHead = diffs.filter(x => x.added !== true && x.removed !== true);
        if(prevHead.length > 0) {
            this.HeadIndex = prevHead[0].value.length;
        }
        const addContent = diffs.filter(x => x.added);
        if(addContent.length > 0) {
            addContent.forEach(c => this.Added += c.value);
        }
        const removeContent = diffs.filter(x => x.removed);
        if(removeContent.length > 0) {
            addContent.forEach(c => this.Removed += c.value);
        }
    }
}