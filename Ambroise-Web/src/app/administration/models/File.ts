export class File {
    constructor(private _id : string, private path : string, private extension : string, private dateOfCreation: string, private displayName: string) { }
    
    get_id(){
        return this._id;
    }

    set_id(_id : string){
        this._id = _id;
    }

    getPath(){
        return this.path;
    }

    setPath(path : string){
        this.path = path;
    }

    getExtension(){
        return this.extension;
    }

    setExtension(extension : string){
        this.extension = extension;
    }

    getDateOfCreation() {
        return new Date(parseInt(this.dateOfCreation, 10));
    }

    setDateOfCreation(dateOfCreation: string) {
        this.dateOfCreation = dateOfCreation;
    }

    getDisplayName(){
        return this.displayName;
    }

    setDisplayName(displayName : string){
        this.displayName = displayName;
    }
}
