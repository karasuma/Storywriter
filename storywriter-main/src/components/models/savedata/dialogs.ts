import { StoryWrtiterViewModel } from "@/components/story-writer-viewmodel";
import { remove } from "@vue/shared";
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

    static messageBox(
        title: string,
        message: string,
        isWarning: boolean = false,
        ask: boolean = false,
        confirmCallback: Function
        ): void
    {
        const buttons = ['OK'];
        if(ask) { buttons.push('Cancel'); }
        remote.dialog.showMessageBox(remote.getCurrentWindow(),
            {
                type: isWarning ? "warning" : "question",
                title: title,
                message: message,
                buttons: buttons,
                cancelId: ask ? 1 : 0
            })
            .then(result => {
                if(result.response.valueOf() == 0) {
                    confirmCallback();
                }
            });
    }
}