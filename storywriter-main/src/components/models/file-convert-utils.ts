import { Utils } from "./utils";

export class FileConverters {
    public source: File | null = null;
    public status: number = FileReader.EMPTY;

    private resourceAttr: ArrayBuffer | null = null;
    private reader: FileReader | null = null;

    public static readonly ReadType = {
        ArrayBuffer: 0,
        BinaryString: 1,
        DataURL: 2,
        Text: 3
    } as const;

    public static readonly FileType = {
        Unknown: 0,
        Image: 1,
        Audo: 2,
    } as const;

    constructor(source: File, loadType: number) {
        this.reload(source, loadType);
    }

    public reload(source: File, loadType: number) {
        this.source = source;

        this.reader = new FileReader();
        this.reader.onload = () => { // Load completed successfully
            const result = this.reader?.result;
            if(!Utils.isNullOrUndefined(result)) {
                if(typeof result == 'string') {
                    this.resourceAttr = new TextEncoder().encode(result).buffer;
                } else {
                    this.resourceAttr = result as ArrayBuffer;
                }
            }
        };
        this.reader.onerror = () => { // Load failed...
            // TODO: logging file load error
        };
        this.reader.onloadstart = () => { // Load start
            this.status = FileReader.LOADING;
        };
        this.reader.onloadend = () => { // Load end
            this.status = FileReader.DONE;
        };

        // Load
        switch(loadType) {
            case FileConverters.ReadType.ArrayBuffer:
                this.reader.readAsArrayBuffer(source);
                break;
            case FileConverters.ReadType.BinaryString:
                this.reader.readAsBinaryString(source);
                break;
            case FileConverters.ReadType.DataURL:
                this.reader.readAsDataURL(source);
                break;
            case FileConverters.ReadType.Text:
                this.reader.readAsText(source);
                break;
            default:
                // TODO: Logging argument error
                throw Error("Argument Error: load type must set from FileConverters.ReadType definitions.");
        }
    }

    public getFileType(): number {
        if(this.source === null) return FileConverters.FileType.Unknown;
        if(this.source.type.indexOf('image') >= 0) {
            return FileConverters.FileType.Image;
        }
        return FileConverters.FileType.Unknown;
    }

    public base64src(): string {
        if(this.source === null) return "";
        if(this.status != FileReader.DONE) return "";
        const src = "data:" + this.source.type + ";base64,";
        return src + Buffer.from(this.resourceAttr as ArrayBuffer).toString('base64');
    }
}