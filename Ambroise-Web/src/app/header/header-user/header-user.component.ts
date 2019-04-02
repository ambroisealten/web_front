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
}

@Component({
  selector: 'app-header-user',
  templateUrl: './header-user.component.html',
  styleUrls: ['./header-user.component.css']
})
export class HeaderUserComponent implements OnInit {
  //modules : Menu[] = [new Menu("Mission",["admin","cdr","manager"],"mission"),new Menu("Compétences",['admin','manager'],'competences'),new Menu("Forum",['admin','manager'],'forum')];
  modules: Menu[] = [];
  displayedModules: Menu[] = [];




  constructor(private titleService: Title, private authGuard: AuthGuard, private router: Router,
    private navigationService: HeaderNavigation) {
    this.getModules();
    this.navigationService.setCurrentModule("Missions");
    console.log(this.modules);
    this.titleService.setTitle("Ambroise - " + this.getCurrentModule());
    if (authGuard.isActivated()) {
      for (let module of this.modules) {
        if (module.roles.indexOf(authGuard.getRole()) > -1) {
          this.displayedModules.push(module);
        }
      }
    }
    //this.modules = this.navigationService.getModules();
  }

  ngOnInit() {
  }

  setCurrentModule(event) {
    //this.currentModule = (event.target.textContent != this.currentModule) ? event.target.textContent : this.currentModule;
    //this.titleService.setTitle("Ambroise - "+this.currentModule);
    let tmp = this.getCurrentModule()
    this.navigationService.setCurrentModule((event.target.textContent != tmp) ? event.target.textContent : tmp);
    this.titleService.setTitle("Ambroise - " + tmp);
    //console.log(tmp);
    //console.log(this.navigationService.getCurrentModule());
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
    for (let module of this.navigationService.getModules().modules) {
      this.modules.push(new Menu(module.label, module.roles, module.routerLink));
    }
  }

}
