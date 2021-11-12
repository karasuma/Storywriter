import { StoryWrtiterViewModel } from "../story-writer-viewmodel";

export class Utils {
    static getUniqueId(seed: number = 0): string {
        const power = seed <= 0 ? (2007 * Math.random()) : seed;
        return new Date().getTime().toString(16) 
            + Math.floor(power * Math.random()).toString(16);
    }

    static sortCondition(prev: number, curr: number, descending: boolean = false) {
        if(prev > curr) {
            return descending ? -1 : 1;
        } else if(prev < curr) {
            return descending ? 1 : -1;
        }
        return 0;
    }

    static hex2rgb(hex: string): [number, number, number] {
        // Validate
        const hexes = hex.substr(1).toUpperCase();
        if(hexes.length != 6 || hexes.match(/[^0-9A-F]/)) return [-1, -1, -1];

        // Convert
        let dec = 0;
        const nums = [0,0,0];
        for(let i = 0; i < hexes.length; i++) {
            dec += "0123456789ABCDEF".indexOf(hexes[i]) * Math.pow(16, 1 - (i % 2));
            if(i % 2 != 0) {
                nums[Math.floor(i / 2)] = dec;
                dec = 0;
            }
        }
        return [nums[0], nums[1], nums[2]];
    }

    static isNullOrUndefined(value: any | unknown): boolean {
        return value === null || value === undefined;
    }

    static isObject(value: any | unknown): boolean {
        const isObj = typeof value === 'object' || typeof value === 'function';
        return !this.isNullOrUndefined(value) && isObj;
    }

    static clamp(value: number, min: number, max: number): number {
        return min <= value ? value <= max ? value : max : min;
    }
}

export class MessageObject {
    public caption: string = "";
    public message: string = "";
    public alert: boolean = false;

    constructor(caption: string, message: string, alert: boolean = false) {
        this.caption = caption;
        this.message = message;
        this.alert = alert;
    }

    static createMessage(caption: string, message: string, alert: boolean = false): MessageObject {
        return new MessageObject(caption, message, alert);
    }
}

export class ImageResource implements IUniqueObject {
    public id: string = Utils.getUniqueId();
    public content: string = "";

    constructor(content: string) {
        this.content = content;
    }
}

export class Position {
    public x: number = 0;
    public y: number = 0;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    public squaringLength(): number {
        return this.x * this.x + this.y * this.y;
    }

    public length(): number {
        return Math.sqrt(this.squaringLength());
    }
}

// Interface definitions ----
export interface IReceiveString {
    (n: string): void
}

export interface IUniqueObject {
    id: string;
}

export interface IReceiveViewmodel {
    (vm: StoryWrtiterViewModel): void
}