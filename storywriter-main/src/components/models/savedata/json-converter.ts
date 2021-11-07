import { StoryWrtiterViewModel } from "@/components/story-writer-viewmodel";
import { DAOConverter, StoryWriterDAO } from "./dao";

export class JsonConverter {
    static toJsonString(viewmodel: StoryWrtiterViewModel) {
        const dao = DAOConverter.toDAO(viewmodel);
        return JSON.stringify(dao);
    }

    static fromJsonString(path: string, json: string): StoryWrtiterViewModel {
        const dao = JSON.parse(json) as StoryWriterDAO;
        const vm = DAOConverter.fromDAO(dao);
        vm.setting.path = path;
        return vm;
    }
}