import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SubMenu, SubSubMenu, Menu } from '../header/models/menu' ;

@Injectable()
export class SubMenusService {


    private menuActionState = new BehaviorSubject("");
    menuActionObservable = this.menuActionState.asObservable();    
    
    private subMenuState = new BehaviorSubject(null);
    subMenuObservable = this.subMenuState.asObservable();

    createMenu(labelSubMenu: string, labelSubSubMenu: string[], icon: string, action: string,):SubMenu{
        let subMenu = new SubMenu() ; 
        if(labelSubSubMenu.length == 0){
            subMenu.label = labelSubMenu ; 
            if(action != null)
                subMenu.action = action ;
            if(icon != null )
                subMenu.icon = icon ;
            
        } else {
            subMenu.label = labelSubMenu ; 
            let subSubMenu: SubSubMenu[] = [];
            labelSubSubMenu.forEach(label => {
                let tmpSubSubMenu = new SubSubMenu() ; 
                tmpSubSubMenu.label = label ; 
                tmpSubSubMenu.icon = icon ; 
                tmpSubSubMenu.action = action ; 
                subSubMenu.push(tmpSubSubMenu) ; 
            })
            subMenu.subSubMenus = subSubMenu ; 
        }
        return subMenu ;
    }

    notifyMenuAction(action:string){
        this.menuActionState.next(action) ; 
    }

    resetMenuAction(){
        this.menuActionState.next("")
    }

    notifySubMenu(menu: Menu){
        this.subMenuState.next(menu);
    }

    resetSubMenu(){
        this.subMenuState.next(null); 
    }
}