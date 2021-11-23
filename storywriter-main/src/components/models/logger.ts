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

    static getLogFilePath(): string {
        const d = new Date();
        const logtime = `${d.getFullYear()}${d.getMonth()+1}${d.getDate()}`;
        return Utils.getUserDataPath() + `\\log-${logtime}.log`;
    }

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
        const header = `${Logger.statusMessage(status)} ${caption} `;
        const occured = `occured.`;
        const content = `${header}${status != Logger.LoggingStatus.Info ? occured : ""}`;
        
        fs.writeFile(
            Logger.getLogFilePath(),
            `${time}\n${content}\n${message}\n\n-\n`,
            {flag: 'a'}
        );
    }
}