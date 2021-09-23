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

// Interface definitions ----
export interface IReceiveString {
    (n: string): void
}

export interface IUniqueObject {
    id: string;
}