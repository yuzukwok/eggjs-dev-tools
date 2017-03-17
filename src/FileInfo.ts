import { statSync } from 'fs';
import { join } from 'path';

export class FileInfo {
    file: string;
    isFile: boolean;
    filePath:string;
    
    constructor(path: string, file: string) {
        this.file = file;
        this.isFile = statSync(join(path, file)).isFile();
        this.filePath=join(path, file);
    }
}
