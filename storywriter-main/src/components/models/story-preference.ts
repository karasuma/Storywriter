export class StoryPreference {
    path: string = "";
    maxImageExpandRatio: number = 5;
    imageExpandPower: number = 3;

    constructor(path: string) {
        this.path = path;
    }
}