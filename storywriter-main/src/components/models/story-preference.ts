export class StoryPreference {
    path: string = "";
    maxImageExpandRatio: number = 5;
    imageExpandPower: number = 3;
    darkmode: boolean = true;

    constructor(path: string) {
        this.path = path;
    }
}