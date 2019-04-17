export class File {
    constructor(private uri: string, private dateOfModification: string, private isForForum: boolean) { }
    getUri() {
        return this.uri;
    }
    setUri(uri: string) {
        this.uri = uri;
    }
    getDateOfModification() {
        return new Date(parseInt(this.dateOfModification, 10));
    }
    setDateOfModification(dateOfModification: string) {
        this.dateOfModification = dateOfModification;
    }
    getIsForForum() {
        return this.isForForum;
    }
    setIsForForum(isForForum: boolean) {
        this.isForForum = isForForum;
    }

    toogleStatus() {
        this.isForForum = !this.isForForum;
    }

}
