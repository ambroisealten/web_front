export class Menu {
    label: string ;
    menus: SubMenu[] ; 

    constructor(label:string, menus: SubMenu[]){
        this.label=label ; 
        this.menus = menus ; 
    }
}

export class SubMenu{
    label: string ; 
    subSubMenus: SubSubMenu[] ; 
    icon: string ;
    action: string; 

    constructor(){
    }
}

export class SubSubMenu{
    label:string ; 
    action: string; 
    icon:string;

    constructor(){
    }
}