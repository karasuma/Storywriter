import { promises as fs } from 'fs';
import { ContentCompressor } from './content-compressor';

export class FileAccessor {
    static readonly prefix: string = "THIS_IS_SOMEONE'S_BRILLIANT_STORY";

    static async Save(path: string, content: string): Promise<FileAccessStatus> {
        const result = new FileAccessStatus();
        try {
            const compressed = ContentCompressor.pack(FileAccessor.prefix + content);
            await fs.writeFile(path, compressed);
            result.successed(`Write successfully completed to: "${path}" !!!`);
        } catch(err) {
            result.failed(err as string);
        }
        return result;
    }

    static async Load(path: string): Promise<FileAccessStatus> {
        const result = new FileAccessStatus();
        try {
            const data = await fs.readFile(path, "utf-8");
            const decompressed = ContentCompressor.unpack(data);
            if(decompressed.indexOf(FileAccessor.prefix) != -1) {
                result.successed(decompressed.replace(FileAccessor.prefix, ""));
            } else {
                throw Error("Invalid story data: Possibly this is not my story data...");
            }
            
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