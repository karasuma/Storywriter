import { ImageResource, IUniqueObject, Utils } from "../utils";

export class ActorItem implements IUniqueObject {
    public id: string = Utils.getUniqueId();
    public name: string = "";
    public face: ImageResource = new ImageResource("");
    public introduce: string = "";
    public detail: string = "";
    public images: ImageResource[] = new Array<ImageResource>();
    public editing: boolean = false;

    constructor(newname: string = "") {
        this.name = newname;
    }

    public addImage(content: string) {
        this.images.push(new ImageResource(content));
    }

    public removeImage(id: string) {
        const idx = this.images.findIndex(res => res.id == id);
        if(idx != -1) {
            this.images.splice(idx, 1);
        }
    }
}