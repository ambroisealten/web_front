import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, Navigation } from '@angular/router';
import { HeaderService } from '../../services/header.services' ; 
import { LoggerService, LogLevel } from 'src/app/services/logger.service';
import { Menu } from '../../models/menu' ; 
import { CurrentModuleService } from '../../services/currentModule.services';
import { IsNotLoginService } from 'src/app/services/isNotLogin.service';
import { SubMenusService } from 'src/app/services/subMenus.service';

@Component({
  selector: 'app-header-user',
  templateUrl: './header-user.component.html',
  styleUrls: ['./header-user.component.scss']
})
export class HeaderUserComponent implements OnInit {

  modules: Menu[] = [
    {label: 'Missions', menus: []},
    {label: 'Compétences', menus: []},
    {label: 'Forum', menus: []}
  ];
  currentModule: string = 'Missions'; 
  done = false;

  constructor(private titleService: Title, private router: Router,
    private headerService: HeaderService, private currentModuleService: CurrentModuleService,
    private isNotLoginService: IsNotLoginService,
    private subMenusService: SubMenusService) { }

  ngOnInit() {
    //this.headerService.notifyMenusReceived(this.modules) ;
    //this.headerService.init().subscribe(menusReceived => this.setModule(menusReceived)) ; 
    //this.currentModuleService.currentModuleObservable.subscribe(currentModule => this.setCurrentModule(currentModule)) ; 
  }

  setModule(menusReceived: Menu[]){
      if (menusReceived != undefined && !this.done) {
        this.modules = menusReceived['modules'] ; 
        this.done = true;
        this.headerService.notifyMenusReceived(menusReceived) ; 
      }
  }


  setCurrentModule(currentModule) {
    this.currentModule = currentModule ;
    this.currentModuleService.notifyCurrentModule(currentModule);
    switch(currentModule){
      case("Missions"):
        this.titleService.setTitle("Ambroise - Missions"); 
        this.router.navigate(['/missions']);
        break; 
      case("Compétences"):
        this.titleService.setTitle("Ambroise - Compétences"); 
        this.router.navigate(['/skills']);
        break;
      case("Forum"):
        this.titleService.setTitle("Ambroise - Forum"); 
        this.router.navigate(['/forum']);
        break;
      default: 
        break;
    }
  }

  /*
  initModules(menuJson) {

    for (let module of menuJson.modules) {
      this.modules.push(new Menu(module.label, module.routerLink));
    }
    return this.modules;

  }
  */

  getCurrentModule():string{
    return this.currentModule ;
  }

  accountClick() {
    window.sessionStorage.clear();
    this.modules = [];
    this.done = false ; 
    this.isNotLoginService.notifyLoginOut(false) ;
    this.router.navigate(['/login']);
  }

  isDone():boolean{
    return this.done ; 
  }

}
