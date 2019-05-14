export class SoftSkill {

    public isSoft: string;

    constructor(public name: string) {
        this.setIsSoft('true');
    }

    public getName() {
        return this.name;
    }

    public setName(name: string) {
        this.name = name;
    }

    public getIsSoft() {
        return this.isSoft;
    }

    public setIsSoft(isSoft: string) {
        this.isSoft = isSoft;
    }

}
