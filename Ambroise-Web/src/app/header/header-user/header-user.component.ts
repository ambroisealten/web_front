import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, Navigation } from '@angular/router';
import { HeaderService } from 'src/app/services/header.services';

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
  styleUrls: ['./header-user.component.css']
})
export class HeaderUserComponent implements OnInit {
  modules: Menu[] = [];


  constructor(private titleService: Title, private router: Router,
    private navigationService: HeaderService) {
    this.getModules();
    setTimeout(() => {
      this.navigationService.setCurrentModuleFromService("Missions");
      this.titleService.setTitle("Ambroise - " + this.getCurrentModule());
    }, 200);
  }

  ngOnInit() {
  }

  setCurrentModule(event) {
    let tmp = this.getCurrentModule()
    this.navigationService.setCurrentModuleFromService((event.target.textContent != tmp) ? event.target.textContent : tmp);
    this.titleService.setTitle("Ambroise - " + tmp);

  }

  getCurrentModule() {
    return this.navigationService.getCurrentModuleFromService();
  }

  getModules() {
    let tmpModules: any;
    this.navigationService.getModulesFromService((tmp) => {
      tmpModules = JSON.parse(tmp);
      for (let module of tmpModules.modules) {
        let m = new Menu(module.label,  module.routerLink);
        this.modules.push(new Menu(module.label, module.routerLink));
      }

    });
    return this.modules;
  }



}
