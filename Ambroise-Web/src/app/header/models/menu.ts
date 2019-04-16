export class Menu {
    label: string ;
    routerLink: string ; 
    menus: Submenu[] ; 

    constructor(label:string, routerlink:string, menus: Submenu[]){
        this.label=label ; 
        this.routerLink = routerlink ; 
        this.menus = menus ; 
    }
}

export class Submenu{
    label: string ; 
    submenus: labelSubmenu[] ; 

    constructor(label: string, submenus: labelSubmenu[]){
        this.label = label ; 
        this.submenus = submenus ; 
    }
}

export class labelSubmenu{
    label:string ; 

    constructor(label: string){
        this.label = label ; 
    }
}