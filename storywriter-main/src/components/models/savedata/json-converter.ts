import { StoryWriterViewModel } from "../../story-writer-viewmodel";
import { DAOConverter, StoryWriterDAO } from "./dao";

export class JsonConverter {
    static toJsonString(viewmodel: StoryWriterViewModel) {
        const dao = DAOConverter.toDAO(viewmodel);
        return JSON.stringify(dao);
    }

    static fromJsonString(json: string): StoryWriterViewModel {
        const dao = JSON.parse(json) as StoryWriterDAO;
        const vm = new StoryWriterViewModel("");
        DAOConverter.fromDAO(dao, vm)
        return vm;
    }
}