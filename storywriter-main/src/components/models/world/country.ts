import { ImageResource, IUniqueObject, Utils } from "../utils";
import { World } from "./worlds";

export class Country implements IUniqueObject {
    public id: string = Utils.getUniqueId();
    public name: string = "世界の何処か";
    public image: ImageResource = new ImageResource("");
    public samples: ImageResource[] = new Array<ImageResource>();
    public description: string = "";
    public editing: boolean = false;
    private parent: World;

    constructor(name: string = "", parent: World) {
        if(name.length != 0) {
            this.name = name;
        }
        this.parent = parent;
    }

    public addSample(src: string): void {
        this.samples.push(new ImageResource(src));
    }

    public removeSample(id: string): void {
        const idx = this.samples.findIndex(s => s.id == id);
        if(idx >= 0) {
            this.samples.splice(idx, 1);
        }
    }

    public deleteMe(): void {
        this.parent.removeCountry(this.id);
    }
}