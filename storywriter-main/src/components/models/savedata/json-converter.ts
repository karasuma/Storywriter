import { StoryWrtiterViewModel } from "../../story-writer-viewmodel";
import { DAOConverter, StoryWriterDAO } from "./dao";

export class JsonConverter {
    static toJsonString(viewmodel: StoryWrtiterViewModel) {
        const dao = DAOConverter.toDAO(viewmodel);
        return JSON.stringify(dao);
    }

    static fromJsonString(json: string): StoryWrtiterViewModel {
        const dao = JSON.parse(json) as StoryWriterDAO;
        const vm = new StoryWrtiterViewModel("");
        DAOConverter.fromDAO(dao, vm)
        return vm;
    }
}