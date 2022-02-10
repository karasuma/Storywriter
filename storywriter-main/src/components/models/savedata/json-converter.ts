import { StoryWriterViewModel } from "../../story-writer-viewmodel";
import { DAOConverter, StoryWriterDAO } from "./dao";
import beautify from 'json-beautify';

export class JsonConverter {
    static toJsonString(viewmodel: StoryWriterViewModel): string {
        const dao = DAOConverter.toDAO(viewmodel);
        //return beautify(dao, null, 2, 80);
        return JSON.stringify(dao);
    }

    static fromJsonString(json: string): StoryWriterViewModel {
        const dao = JSON.parse(json) as StoryWriterDAO;
        const vm = new StoryWriterViewModel(StoryWriterViewModel.CREATE_BLANK);
        DAOConverter.fromDAO(dao, vm)
        return vm;
    }
}