import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../services/header.services' ; 
import { LoggerService, LogLevel } from 'src/app/services/logger.service';
import { Menu } from '../../models/menu';
import { CurrentModuleService } from '../../services/currentModule.services';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-header-menu',
    templateUrl: './header-menu.component.html',
    styleUrls: ['./header-menu.component.scss']
})
export class HeaderMenuComponent implements OnInit {

    modules: Menu[] ;
    currentModule: string = 'Missions'; 
    done: boolean ;

    constructor(private headerService: HeaderService,
        private currentModuleService: CurrentModuleService) { }

    ngOnInit() {
        this.headerService.menuReceptionObservable.subscribe(menusReceived => this.setModule(menusReceived)) ; 
        this.currentModuleService.currentModuleObservable.subscribe(currentModule => this.setCurrentModule(currentModule)) ; 
    }

    setModule(menu: Menu[]){
        if(menu != undefined){
            this.done = true ; 
            this.modules = menu['modules'] ; 
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
