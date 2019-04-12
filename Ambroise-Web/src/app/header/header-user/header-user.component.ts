import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, Navigation } from '@angular/router';
import { HeaderService } from 'src/app/services/header.services';
import { LoggerService, LogLevel } from 'src/app/services/logger.service';

export class Menu {
  name: string;
  routerLink: string;

  constructor(name: string, routerLink: string) {
    this.name = name;
    this.routerLink = routerLink;
  }

  toString() {
    return "label : " + this.name + "routerlink : " + this.routerLink;
  }
}

@Component({
  selector: 'app-header-user',
  templateUrl: './header-user.component.html',
  styleUrls: ['./header-user.component.scss']
})
export class HeaderUserComponent implements OnInit {
  private modules: Menu[] = [];
  private done = false;

  constructor(private titleService: Title, private router: Router,
    private headerService: HeaderService) { }

  ngOnInit() {
    this.headerService.init();
    this.headerService.menuReceptionObservable.subscribe(menusReceived => {
      LoggerService.log("menus received in header-user : " + menusReceived, LogLevel.DEBUG);
      if (menusReceived != undefined && !this.done) {
        this.initModules(menusReceived);
        this.done = true;
      }
    })
    this.headerService.setCurrentModuleFromService(this.headerService.getCurrentModuleFromService());
    this.titleService.setTitle("Ambroise - " + this.getCurrentModule());
  }

  setCurrentModule(event) {
    let tmp = this.headerService.getCurrentModuleFromService();
    this.headerService.setCurrentModuleFromService((event.target.textContent != tmp) ? event.target.textContent : tmp);
    this.titleService.setTitle("Ambroise - " + this.headerService.getCurrentModuleFromService());

  }

  getCurrentModule() {
    return this.headerService.getCurrentModuleFromService();
  }

  initModules(menuJson) {

    for (let module of menuJson.modules) {
      this.modules.push(new Menu(module.label, module.routerLink));
    }
    return this.modules;

  }

  accountClick() {
    window.sessionStorage.clear();
    this.modules = [];
    this.router.navigate(['/login']);
  }

}
