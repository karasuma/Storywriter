import { DAOConverter } from "@/components/models/savedata/dao";
import { StoryWriterViewModel, StoryWriterViewModelSample } from "@/components/story-writer-viewmodel";
import { expect } from "chai";

describe("DAO", () => {
    describe("Get/Set", () => {
        it("check successed to convert from Viewmodel to DAO", () => {
            // Arrange
            const vm = new StoryWriterViewModelSample();

            // Act
            const dao = DAOConverter.toDAO(vm);
            const newvm = new StoryWriterViewModel("");
            DAOConverter.fromDAO(dao, newvm);
            //const original = DAOConverter.fromDAO(dao).memos.memoList[0].id;
            const original = newvm.memos.memoList[0].id;
            const target = vm.memos.memoList[0].id;

            // Assert
            expect(original).to.equal(target);
        });
    });
});