import { ContentCompressor } from "@/components/models/savedata/content-compressor";
import { expect } from "chai";

describe("Content packer tests", () => {
    it("Success to convert text?", () => {
        // Arrange
        const plane = "There was presented to me a peach, And I returned for it a plum."

        // Act
        const packed = ContentCompressor.pack(plane);
        const unpacked = ContentCompressor.unpack(packed);

        // Assert
        console.log(packed);
        expect(unpacked).to.equal(plane);
    });
});