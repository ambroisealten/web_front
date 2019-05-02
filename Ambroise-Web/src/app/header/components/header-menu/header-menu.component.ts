import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../services/header.services' ; 
import { LoggerService, LogLevel } from 'src/app/services/logger.service';
import { Menu } from '../../models/menu';
import { CurrentModuleService } from '../../services/currentModule.services';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SubMenusService } from 'src/app/services/subMenus.service';

@Component({
    selector: 'app-header-menu',
    templateUrl: './header-menu.component.html',
    styleUrls: ['./header-menu.component.scss']
})
export class HeaderMenuComponent implements OnInit {

    modules: Menu[] = [
        {label: 'Missions', menus: []},
        {label: 'Compétences', menus: []},
        {label: 'Forum', menus: []}
      ];
    currentModule: string = 'Missions'; 
    done: boolean ;

    constructor(private headerService: HeaderService,
        private currentModuleService: CurrentModuleService,
        private router: Router,
        private subMenusService: SubMenusService) { }

    ngOnInit() {
        this.subMenusService.subMenuObservable.subscribe(subMenus => this.setSubMenus(subMenus))
        this.currentModuleService.currentModuleObservable.subscribe(currentModule => this.setCurrentModule(currentModule)) ; 
    }

    
  setSubMenus(subMenus: Menu){
    if(subMenus != null){
      this.modules.forEach(menu => {
        if(menu.label === subMenus.label){
          menu.menus = subMenus.menus ; 
        }
      })
    }
  }

    sendAction(action: string){
        this.subMenusService.notifyMenuAction(this.router.url+"//"+action) ; 
    }

    setModule(menu: Menu[]){
        if(menu != undefined && menu.hasOwnProperty('modules')){
            this.done = true ; 
            this.modules = menu['modules'] ; 
        } else if (menu != undefined ){
            this.modules = menu ; 
            this.done = true ;
        }
    }

    setCurrentModule(currentModule: string){
        this.currentModule = currentModule ; 
    }

    getCurrentModule():string{
        return this.currentModule ; 
    }

    isDone():boolean{
        return this.done ;
    }


}
