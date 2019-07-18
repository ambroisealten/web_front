export class Skill {
    public name: string;
    public synonymous: string[];
    public replaceWith: string;

    constructor(name: string, synonymous : string[], replaceWith : string) {}

    public getName() {
        return this.name;
    }

    public setName(name: string) {
        this.name = name;
    }

    public getSynonymous() {
        return this.synonymous;
    }

    public setSynonymous(synonymous: string[]) {
        this.synonymous = synonymous;
    }

    public getReplaceWith() {
        return this.replaceWith;
    }

    public setReplaceWith(replaceWith: string) {
        this.replaceWith = replaceWith;
    }

}