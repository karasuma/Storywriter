import { FileAccessor } from "@/components/models/savedata/file-accessor";
import { expect } from "chai";

describe("File accessor tests", () => {
    const unwritableFilePath = "J:\\Temporary\\Unwritable.txt";
    const writableFilePath = "J:\\Temporary\\Writable.txt";
    const writeData = "The Dao that can be trodden is not the enduring and unchanging Dao."

    describe("Write", () => {
        it("write successfully completed?", () => {
            // Arrange (x)
            // Act & Assert
            FileAccessor.Save(writableFilePath, writeData)
                .then(result => {
                    expect(result.isSuccess).to.equal(true);
                });
        });
        it("write failed?", () => {
            // Arrange (x)
            // Act& Assert
            FileAccessor.Save(unwritableFilePath, writeData)
                .then(result => {
                    expect(result.isSuccess).to.equal(false);
                });
        });
    });

    describe("Read", () => {
        it("read successfully competed?", () => {
            // Arrange (x)
            // Act & Assert
            FileAccessor.Load(writableFilePath)
                .then(result => {
                    expect(result.content).to.equal(writeData);
                });
        });
        it("read failed?", () => {
            // Arrange (x)
            // Act & Assert
            FileAccessor.Load("..\\this\\file\\isnot\\exists.txt")
                .then(result => {
                    expect(result.isSuccess).to.equal(false);
                });
        });
    });
});