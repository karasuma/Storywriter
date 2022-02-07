import { StoryWriterViewModel } from "../story-writer-viewmodel";
import { ContentCompressor } from "./savedata/content-compressor";
import { JsonConverter } from "./savedata/json-converter";
import { ViewmodelUpdater } from "./savedata/vm-udpater";
import { Enumerable } from "./utils";

export default class OperationHistory {
    public history: string[] = new Array<string>();
    public maxHistory = 100;
    public currentPosition = -1;
    public headPosition = -1;

    public Clear(): void {
        this.history.splice(0);
        this.currentPosition = -1;
        this.headPosition = -1;
    }

    public Push(vm: StoryWriterViewModel): void {
        const newHistory = ContentCompressor.pack(JsonConverter.toJsonString(vm));
        this.history.push(newHistory);
    }

    public Update(currentVm: StoryWriterViewModel): void {
        // Don't update if the current data is the same as the previous data
        if(this.currentPosition > 0) {
            const current = JsonConverter.toJsonString(currentVm);
            const previous = JsonConverter.toJsonString(this.Pickup(this.currentPosition));
            if(current === previous) return;
        }

        // Update history when the position moved back
        if(this.history.length > 0 && this.currentPosition < this.headPosition) {
            this.history.splice(this.currentPosition + 1);
        }

        // Add new history
        this.Push(currentVm);
        this.currentPosition++;

        // Displace histories when the position reached the head position
        if(this.currentPosition >= this.maxHistory) {
            Enumerable.Range(this.history.length - 1, 1).forEach(i => {
                this.history[i - 1] = this.history[i];
            });
            this.history.splice(this.history.length - 1);
            this.currentPosition--;
        }

        this.headPosition = this.currentPosition;
    }

    public Pickup(index: number): StoryWriterViewModel {
        return JsonConverter.fromJsonString(ContentCompressor.unpack(this.history[index]));
    }

    public Restore(targetVm: StoryWriterViewModel, index: number): void {
        ViewmodelUpdater.Update(targetVm, this.Pickup(index));
    }

    public Undo(currentVm: StoryWriterViewModel): void {
        if(this.currentPosition <= 0) return;
        this.currentPosition--;
        this.Restore(currentVm, this.currentPosition);
    }

    public Redo(currentVm: StoryWriterViewModel): void {
        if(this.currentPosition >= this.headPosition) return;
        this.currentPosition++;
        this.Restore(currentVm, this.currentPosition);
    }
}