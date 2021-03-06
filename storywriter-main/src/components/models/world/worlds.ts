import { IUniqueObject, Utils } from "../utils";
import { Country } from "./country";

export class Worlds {
    public worldGroups: World[] = new Array<World>();

    public addWorld(name: string): void {
        this.worldGroups.push(new World(name, this));
    }

    public appendWorld(world: World): void {
        this.worldGroups.push(world);
    }

    public removeWorld(id: string): void {
        const idx = this.worldGroups.findIndex(x => x.id == id);
        if(idx >= 0) {
            this.worldGroups.splice(idx, 1);
        }
    }

    public clear(): void {
        this.worldGroups.forEach(w => {
            w.countries.forEach(c => c.samples.splice(0));
            w.countries.splice(0);
        });
        this.worldGroups.splice(0);
    }
}

export class World implements IUniqueObject {
    public id: string = Utils.getUniqueId();
    public name = "";
    public countries: Country[] = new Array<Country>();
    public expanding = false;
    private parent: Worlds;

    constructor(defaultName: string, parent: Worlds){
        this.name = defaultName;
        this.parent = parent;
    }

    public addCountry(name = ""): void {
        this.countries.push(new Country(name, this));
    }

    public removeCountry(id: string): void {
        const idx = this.countries.findIndex(x => x.id == id);
        if(idx >= 0) {
            this.countries.splice(idx, 1);
        }
    }

    public getEditingCountry(): Country | undefined {
        return this.countries.find(c => c.editing);

    }

    public deleteMe(): void {
        this.parent.removeWorld(this.id);
    }
}