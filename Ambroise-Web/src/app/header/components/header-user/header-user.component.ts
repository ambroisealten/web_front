import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Menu } from '../../models/menu' ; 
import { IsNotLoginService } from 'src/app/services/isNotLogin.service';
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

  currentModule: string = 'Compétences'; 
  done = false;

  constructor(private titleService: Title,
     private router: Router,
    private isNotLoginService: IsNotLoginService){}

  ngOnInit() {
  }

  setCurrentModule(currentModule) {
    this.currentModule = currentModule ;
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
