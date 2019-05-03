import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HeaderService } from '../../services/header.services' ; 
import { LoggerService, LogLevel } from 'src/app/services/logger.service';
import { Menu, SubMenu } from '../../models/menu';
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

    subMenus: SubMenu[] = [] ; 
    done: boolean = false  ;

    constructor(
        private router: Router,
        private subMenusService: SubMenusService) { }

    ngOnInit() {
        //this.subMenusService.subMenuObservable.subscribe(subMenus => this.setSubMenus(subMenus))
    }

    ngAfterViewInit(){
        this.subMenusService.subMenuObservable.subscribe(subMenus => this.setSubMenus(subMenus))
    }

    ngOnDestroy(){
        console.log("la")
    }
    
  setSubMenus(subMenus: SubMenu[]){
    console.log(subMenus)
    if(subMenus != null && subMenus.length > 0){
        this.subMenus = subMenus
    } else {
        this.subMenus = [] ; 
    }
  }

    sendAction(action: string){
        this.subMenusService.notifyMenuAction(this.router.url+"//"+action) ; 
    }

}
