import zlib from 'zlib';

export class ContentCompressor {
    static pack(plane: string): string {
        return zlib.gzipSync(plane).toString('base64');
    }

    static unpack(b64: string): string {
        return zlib.gunzipSync(Buffer.from(b64, 'base64')).toString('utf-8');
    }
}