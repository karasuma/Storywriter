import OperationHistory from "@/components/models/operation-history";
import { Enumerable } from "@/components/models/utils";
import { StoryWriterViewModel } from "@/components/story-writer-viewmodel";
import { expect } from "chai";

describe("Operation History Tests", () => {
    it("Success to update history?", () => {
        // Arrange
        const vm = new StoryWriterViewModel();
        vm.loadDefaultStories();
        vm.history.Update(vm);

        // Act
        const newMemo = "Sample Memo";
        vm.memos.addMemo(newMemo);
        vm.history.Update(vm);
        const prev = vm.history.Pickup(vm.history.currentPosition - 1);
        const next = vm.history.Pickup(vm.history.currentPosition);

        // Assert
        expect(prev.memos.memoList.map(x => x.name)).not.contain(newMemo);
        expect(next.memos.memoList.map(x => x.name)).contain(newMemo);
    });

    it("Success to undo history?", () => {
        // Arrange
        const vm = new StoryWriterViewModel();
        vm.loadDefaultStories();
        vm.history.Update(vm);
        const firstMemo = "Sample Memo 1";
        const secondMemo = "Sample Memo 2";

        // Act
        vm.memos.addMemo(firstMemo);
        vm.history.Update(vm);
        vm.memos.addMemo(secondMemo);
        vm.history.Update(vm);
        vm.history.Undo(vm);

        // Assert
        expect(vm.history.Pickup(vm.history.headPosition).memos.memoList.map(x => x.name)).contain(secondMemo);
        expect(vm.memos.memoList.map(x => x.name)).not.contain(secondMemo);
    });

    it("Success to redo history?", () => {
        // Arrange
        const vm = new StoryWriterViewModel();
        vm.loadDefaultStories();
        vm.history.Update(vm);
        const firstMemo = "Sample Memo 1";
        const secondMemo = "Sample Memo 2";
        const thirdMemo = "Sample Memo 3";

        // Act
        vm.memos.addMemo(firstMemo);
        vm.history.Update(vm);
        vm.memos.addMemo(secondMemo);
        vm.history.Update(vm);
        vm.memos.addMemo(thirdMemo);
        vm.history.Update(vm);
        vm.history.Undo(vm);
        vm.history.Undo(vm);
        vm.history.Redo(vm);

        // Assert
        const firstMemoIndex = 1;
        expect(vm.history.Pickup(firstMemoIndex).memos.memoList.map(x => x.name)).not.contain(secondMemo);
        expect(vm.memos.memoList.map(x => x.name)).contain(secondMemo);
    });

    it("Success to shift history?", () => {
        // Arrange
        const vm = new StoryWriterViewModel();
        vm.history.maxHistory = 5;
        vm.loadDefaultStories();
        vm.history.Update(vm);
        const firstMemo = "First Memo";
        const memo = "Sample Memo";

        // Act
        vm.memos.addMemo(firstMemo);
        vm.history.Update(vm);
        vm.memos.removeMemo(vm.memos.memoList.find(x => x.name == firstMemo)!.id);
        vm.history.Update(vm);
        Enumerable.Range(vm.history.maxHistory + 1).forEach(_ => {
            vm.memos.addMemo(memo);
            vm.history.Update(vm);
        });

        // Assert
        expect(vm.history.Pickup(0).memos.memoList.map(x => x.name)).not.contain(firstMemo);
    });

    it("Success to ignore pushing new history when the same as previous history?", () => {
        // Arrange
        const vm = new StoryWriterViewModel();
        vm.history.maxHistory = 5;
        vm.loadDefaultStories();
        vm.history.Update(vm);

        // Act
        vm.history.Update(vm);
        vm.history.Update(vm);

        // Assert
        expect(vm.history.currentPosition).equal(1);
    });
});