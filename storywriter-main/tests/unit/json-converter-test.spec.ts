import { JsonConverter } from "@/components/models/savedata/json-converter";
import { StoryWriterViewModelSample } from "@/components/story-writer-viewmodel";
import { expect } from "chai";

describe("Json Converter", () => {
    describe("Convert", () => {
        it("Check succeed to convert back and forward between Viewmodel to Json string",
            () => {
                // Arrange
                const vm = new StoryWriterViewModelSample();

                // Act
                const json = JsonConverter.toJsonString(vm);
                const after = JsonConverter.fromJsonString(json);

                // Assert
                const beforeID = vm.memos.memoList[0].id;
                const afterID = after.memos.memoList[0].id;
                expect(json).to.include(beforeID);
                expect(afterID).to.equal(beforeID);
            }
        );
    });
});