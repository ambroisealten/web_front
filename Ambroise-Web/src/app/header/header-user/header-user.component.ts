import { Component, OnInit } from '@angular/core';
import { AuthGuard } from 'src/app/services/auth-guard.service';
import { Title } from '@angular/platform-browser';
import { Router, Navigation } from '@angular/router';
import { HeaderNavigation } from 'src/app/services/navigation.services';

export class Menu {
  name: string;
  roles: string[];
  routerLink: string;

  constructor(name: string, roles: string[], routerLink: string) {
    this.name = name;
    this.roles = roles;
    this.routerLink = routerLink;
  }

  toString() {
    return "label : " + this.name + " role : [" + this.roles + "] routerlink : " + this.routerLink;
  }
}

@Component({
  selector: 'app-header-user',
  templateUrl: './header-user.component.html',
  styleUrls: ['./header-user.component.css']
})
export class HeaderUserComponent implements OnInit {
  modules: Menu[] = [];
  displayedModules: Menu[] = [];




  constructor(private titleService: Title, private authGuard: AuthGuard, private router: Router,
    private navigationService: HeaderNavigation) {
    this.getModules();
    setTimeout(() => {
      this.navigationService.setCurrentModule("Missions");
      this.titleService.setTitle("Ambroise - " + this.getCurrentModule());
      for (let module of this.modules) {
        this.displayedModules.push(module);
      }
    }, 200);
  }

  ngOnInit() {
  }

  setCurrentModule(event) {
    let tmp = this.getCurrentModule()
    this.navigationService.setCurrentModule((event.target.textContent != tmp) ? event.target.textContent : tmp);
    this.titleService.setTitle("Ambroise - " + tmp);

  }

  getCurrentModule() {
    return this.navigationService.getCurrentModule();
  }

  accountClick() {
    if (this.authGuard.isActivated()) {
      this.router.navigate(['']);
    }
    else {
      this.router.navigate(['content']);
    }
  }

  getModules() {
    let tmpModules: any;
    this.navigationService.getModulesFromService((tmp) => {
      tmpModules = JSON.parse(tmp);
      for (let module of tmpModules.modules) { //this.navigationService.getModules().modules) {
        let m = new Menu(module.label, module.roles, module.routerLink);
        this.modules.push(new Menu(module.label, module.roles, module.routerLink));
      }

    });
    return this.modules;
  }



}
