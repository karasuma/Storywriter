import { promises as fs } from 'fs';

export class FileAccessor {
    static async Save(path: string, content: string): Promise<FileAccessStatus> {
        const result = new FileAccessStatus();
        try {
            await fs.writeFile(path, content);
            result.done(`Write successfully completed to: ${path}!`);
        } catch(err) {
            result.failed(err as string);
        }
        return result;
    }

    static async Load(path: string): Promise<FileAccessStatus> {
        const result = new FileAccessStatus();
        try {
            result.done(await fs.readFile(path, "utf-8"));
        } catch(err) {
            result.failed(err as string);
        }
        return result;
    }
}

export class FileAccessStatus {
    public isAccessing: boolean = true;
    public isSuccess: boolean = false;
    public content: string = "";

    public switchLoading(): void {
        this.isAccessing = true;
    }

    public successed(content: string): void {
        this.isSuccess = true;
        this.done(content);
    }

    public failed(content: string): void {
        this.isSuccess = false;
        this.done(content);
    }

    public done(content: string): void {
        this.isAccessing = false;
        this.content = content;
    }
}