import { Enumerable } from "@/components/models/utils";
import { StoryWriterViewModel } from "@/components/story-writer-viewmodel";
import { expect } from "chai";

describe("Operation History Tests", () => {
    it("Success to update history?", () => {
        // Arrange
        const vm = new StoryWriterViewModel();
        vm.loadDefaultStories();

        // Act
        const newMemo = "(Success to update history?)";
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
        const firstMemo = "(Success to undo history?) 1";
        const secondMemo = "(Success to undo history?) 2";

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
        const firstMemo = "(Success to redo history?) 1";
        const secondMemo = "(Success to redo history?) 2";
        const thirdMemo = "(Success to redo history?) 3";

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
        const firstMemoIndex = 0;
        expect(vm.history.Pickup(firstMemoIndex).memos.memoList.map(x => x.name)).not.contain(secondMemo);
        expect(vm.memos.memoList.map(x => x.name)).contain(secondMemo);
    });

    it("Success to ignore pushing new history when the same as previous history?", () => {
        // Arrange
        const vm = new StoryWriterViewModel();
        vm.loadDefaultStories();

        // Act
        vm.history.Update(vm);
        vm.history.Update(vm);
        vm.history.Update(vm);
        vm.history.Update(vm);

        // Assert
        expect(vm.history.currentPosition).equal(0);
    });
});