import { FileAccessor } from "./savedata/file-accessor";
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

    public save(): void {
        const json = JSON.stringify([
            this.maxImageExpandRatio,
            this.imageExpandPower,
            this.darkmode
        ]);
        console.log(json);
        FileAccessor.Save(this.settingPath, json)
            .then(result => {
                console.log(result);
            })
    }

    public load(): void {
        FileAccessor.Load(this.settingPath)
            .then(result => {
                if(result.isSuccess) {
                    console.log(result.content);
                    const setting = JSON.parse(result.content) as Array<number | boolean>;
                    this.maxImageExpandRatio = setting[0] as number;
                    this.imageExpandPower = setting[1] as number;
                    this.darkmode = setting[2] as boolean;
                }
            });
    }
}