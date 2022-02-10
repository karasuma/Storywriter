import { promises as fs } from 'fs';
import { ContentCompressor } from './content-compressor';

export class FileAccessor {
    static readonly prefix: string = "THIS_IS_SOMEONE'S_BRILLIANT_STORY";

    /**
     * Save content to the file you want to save it for (append prefix for the head of content).
     * @param path Target's absolute file path
     * @param content Viewmodel contents you want to save
     * @returns Saved file status
     */
    static async Save(path: string, content: string): Promise<FileAccessStatus> {
        const compressed = ContentCompressor.pack(FileAccessor.prefix + content);
        return this.SaveSimple(path, compressed);
    }

    /**
     * Save content to the file you want to save it for.
     * @param path Target's absolute file path
     * @param content Contents you want to save
     * @returns Saved file status
     */
    static async SaveSimple(path: string, content: string, append?: boolean): Promise<FileAccessStatus> {
        const result = new FileAccessStatus();
        try {
            if(append) {
                await fs.appendFile(path, content);
            } else {
                await fs.writeFile(path, content);
            }
            result.successed(`Write successfully completed to: "${path}" !!!`);
        } catch(err) {
            result.failed(err as string, err as string);
        }
        return result;
    }

    /**
     * Load content from the file and check the prefix.
     * @param path Savefile's absolute path
     * @returns Loaded file status
     */
    static async Load(path: string): Promise<FileAccessStatus> {
        const content = await this.LoadSimple(path);
        const result = new FileAccessStatus();
        if(content.isSuccess) {
            const decompressed = ContentCompressor.unpack(content.content);
            if(decompressed.indexOf(FileAccessor.prefix) != -1) {
                result.successed(decompressed.replace(FileAccessor.prefix, ""));
            } else {
                throw Error("Invalid story data: Possibly this is not your story data...");
            }
        } else {
            result.failed(`Failed to load your story data... (${content.error as string})`, content.error);
        }
        return result;
    }

    /**
     * Load content from the file.
     * @param path Target's absolute path
     * @returns Loaded file status
     */
    static async LoadSimple(path: string): Promise<FileAccessStatus> {
        const result = new FileAccessStatus();
        try {
            const data = await fs.readFile(path, "utf-8");
            result.successed(data);
        } catch(err) {
            result.failed(`Failed to load from file [${path}] (${err as string})`, err as string);
        }
        return result;
    }
}

export class FileAccessStatus {
    public isAccessing = true;
    public isSuccess = false;
    public content = "";
    public error = "";

    public switchLoading(): void {
        this.isAccessing = true;
    }

    public successed(content: string): void {
        this.isSuccess = true;
        this.done(content);
    }

    public failed(content: string, error: string): void {
        this.isSuccess = false;
        this.error = error;
        this.done(content);
    }

    public done(content: string): void {
        this.isAccessing = false;
        this.content = content;
    }
}