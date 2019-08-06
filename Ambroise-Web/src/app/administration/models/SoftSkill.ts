export class SoftSkill {
    public order: number;
    public isSoft: string;

    constructor(public name: string, order : number) {
        this.setIsSoft('true');
        this.order = order;
    }

    public getOrder(){
        return this.order;
    }

    public setOrder(order : number){
        this.order = order;
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
