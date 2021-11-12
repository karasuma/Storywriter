import { StoryWrtiterViewModel } from "@/components/story-writer-viewmodel";
import { remote } from "electron";
import { Utils } from "../utils";

export class Dialogs {
    static openSaveWindow(vm: StoryWrtiterViewModel, saveCallback: Function): void {
        remote.dialog.showSaveDialog(remote.getCurrentWindow(), {
            filters: [
                { name: "セーブファイル (Your Story Data)", extensions: ["ysd"]},
                { name: "All Files", extensions: ["*"]}
            ]}
        ).then(result => {
            if(!Utils.isNullOrUndefined(result.filePath) && result.filePath!.length > 0) {
                vm.setting.path = result.filePath!;
                saveCallback();
            }
        });
    }
}