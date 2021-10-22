import { ImageResource, IUniqueObject, Utils } from "../utils";

export class Word implements IUniqueObject {
    public readonly id: string = Utils.getUniqueId();
    public editing: boolean = false;
    public caption: string = "";
    public description: string = "";
    public resources: ImageResource[] = new Array<ImageResource>();

    addResource(content: string) {
        this.resources.push(new ImageResource(content));
    }

    removeResource(targetId: string) {
        const target = this.resources.findIndex(x => x.id == targetId);
        console.log(target);
        if(target >= 0) {
            this.resources.splice(target, 1);
        }
    }
}