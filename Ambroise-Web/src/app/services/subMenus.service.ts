import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SubMenu, SubSubMenu } from '../header/models/menu' ;

@Injectable()
export class SubMenusService {


    private menuActionState = new BehaviorSubject("");
    menuActionObservable = this.menuActionState.asObservable();    
    
    private subMenuState = new BehaviorSubject(null);
    subMenuObservable = this.subMenuState.asObservable();

    constructor(){
        console.log("Création");
    }

    createMenu(labelSubMenu: string, labelSubSubMenu: any[], icon: string, action: string,subAction: string[]):SubMenu{
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
                tmpSubSubMenu.label = label['name'] ; 
                if(icon != null )
                tmpSubSubMenu.icon = icon ; 
                let finalAction: string = "" ;
                if(action != null){
                    finalAction += action ; 
                }
                if(subAction != null && subAction.length > 0){
                    subAction.forEach(subAction => {
                        finalAction += label[subAction] + '/'
                    })
                }
                tmpSubSubMenu.action = finalAction ; 
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

    notifySubMenu(subMenu: SubMenu[]){
        this.subMenuState.next(subMenu);
    }

    resetSubMenu(){
        this.subMenuState.next(null); 
    }
}