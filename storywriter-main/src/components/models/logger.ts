import { FileAccessor } from "./savedata/file-accessor";
import { Utils } from "./utils";
import { promises as fs } from 'fs';

export default class Logger {
    static readonly LoggingStatus = {
        Info: 0,
        Warn: 1,
        Err: 2,
        Fatal: 3
    } as const;

    private static statusMessage(status: number): string {
        switch(status) {
            case Logger.LoggingStatus.Info:
                return "[Info ]";
            case Logger.LoggingStatus.Warn:
                return "[Warn ]";
            case Logger.LoggingStatus.Err:
                return "[Error]";
            case Logger.LoggingStatus.Fatal:
                return "[Fatal]";
        }
        return "[ ??? ]";
    }

    static write(caption: string, message: string, status: number): void {
        const d = new Date();
        const time = d.toLocaleString('ja-JP', { timeZone: 'JST' });
        const header = `${Logger.statusMessage(status)} ${caption} occured at "${time}"`;
        const content = `${header}\n${message}\n\n-\n`;

        const logtime = `${d.getFullYear()}${d.getMonth()+1}${d.getDate()}`;
        const path = Utils.getUserDataPath() + `\\log-${logtime}.log`;
        fs.writeFile(path, content, {flag: 'a'});
    }
}