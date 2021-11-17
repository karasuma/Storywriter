import { ActorItem } from "./actor-item";

export class Actors {
    public actors: ActorItem[] = new Array<ActorItem>();

    public createNewActor(name: string = "") {
        this.actors.push(new ActorItem(name));
    }

    public removeActor(id: string) {
        const idx = this.actors.findIndex(a => a.id == id);
        if(idx != -1) {
            this.actors.splice(idx, 1);
        }
    }

    public clear(): void {
        this.actors.splice(0);
    }
}