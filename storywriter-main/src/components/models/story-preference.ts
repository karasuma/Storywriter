import { FileAccessor } from "./savedata/file-accessor";
import { SystemMessage } from "./system-message";
import { Utils } from "./utils";

export class StoryPreference {
    path: string = "";
    maxImageExpandRatio: number = 5;
    imageExpandPower: number = 3;
    darkmode: boolean = true;

    showing: boolean = false;
    settingPath: string = Utils.getUserDataPath() + "\\setting.scrap";

    constructor(path: string) {
        this.path = path;
    }

    public save(message: SystemMessage): void {
        const json = JSON.stringify([
            this.maxImageExpandRatio,
            this.imageExpandPower,
            this.darkmode ? 1 : 0
        ]);
        console.log(json);
        FileAccessor.Save(this.settingPath, json)
            .then(result => {
                message.message = result.content;
                message.changeMessage(
                    result.isSuccess
                        ? "Setting file save completed!"
                        : result.content ,
                    result.isSuccess 
                        ? SystemMessage.MessageType.Normal
                        : SystemMessage.MessageType.Alert
                );
            })
    }

    public load(): void {
        FileAccessor.Load(this.settingPath)
            .then(result => {
                if(result.isSuccess) {
                    const setting = JSON.parse(result.content) as Array<number>;
                    this.maxImageExpandRatio = setting[0];
                    this.imageExpandPower = setting[1];
                    this.darkmode = setting[2] == 1;
                }
            });
    }
}