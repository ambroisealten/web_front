export class File {
    constructor(public _id: any, public path: string, public extension: string, public dateOfCreation: string, public displayName: string) { }

    static equals(files: File[], fileToCompare: File): boolean {
        let result = false;
        files.forEach(file => {
            console.log(fileToCompare._id === file._id);
            if (fileToCompare._id === file._id) {
                result = true;
                return; 
            }
        });
        return result;
    }
}
