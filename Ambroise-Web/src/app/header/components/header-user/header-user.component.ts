import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Menu } from '../../models/menu';
import { IsNotLoginService } from 'src/app/services/isNotLogin.service';
import { HeaderService } from '../../services/header.services';
@Component({
  selector: 'app-header-user',
  templateUrl: './header-user.component.html',
  styleUrls: ['./header-user.component.scss']
})
export class HeaderUserComponent implements OnInit {

  modules: Menu[] = [];
  currentModule = 'Compétences';
  done = false;

  constructor(
    private titleService: Title,
    private router: Router,
    private isNotLoginService: IsNotLoginService,
    private headerService: HeaderService) {
    this.initModules();
  }

  ngOnInit() {
  }

  setCurrentModule(currentModule) {
    this.currentModule = currentModule;
    switch (currentModule) {
      case ('Missions'):
        this.titleService.setTitle('Ambroise - Missions');
        this.router.navigate(['/missions']);
        break;
      case ('Compétences'):
        this.titleService.setTitle('Ambroise - Compétences');
        this.router.navigate(['/skills']);
        break;
      case ('Forum'):
        this.titleService.setTitle('Ambroise - Forum');
        this.router.navigate(['/forum']);
        break;
      case ('Administration'):
        this.titleService.setTitle('Ambroise - Administration');
        this.router.navigate(['/admin']);
        break;
      default:
        break;
    }
  }


  initModules() {
    console.log(this.modules);
    this.headerService.init().subscribe((menus) => {
      const modules = menus['modules'];
      for (const module of modules) {
        this.modules.push(new Menu(module.label, module.routerLink));
      }
      console.log(this.modules);
      return this.modules;
    });
  }


  getCurrentModule(): string {
    return this.currentModule;
  }

  accountClick() {
    window.sessionStorage.clear();
    this.modules = [];
    this.done = false;
    this.isNotLoginService.notifyLoginOut(false);
    this.router.navigate(['/login']);
  }

  isDone(): boolean {
    return this.done;
  }

}
