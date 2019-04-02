import { Component, OnInit } from '@angular/core';
import { AuthGuard } from 'src/app/services/auth-guard.service';
import { Title } from '@angular/platform-browser';
import { Router, Navigation } from '@angular/router';
import { HeaderNavigation } from 'src/app/services/navigation.services';

export class Menu{
  name : string;
  roles : string[];
  routerLink : string;

  constructor(name : string, roles : string[], routerLink : string){
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
  modules : Menu[] = [new Menu("Mission",["admin","cdr","manager"],"mission"),new Menu("Compétences",['admin','manager'],'competences'),new Menu("Forum",['admin','manager'],'forum')];
  displayedModules : Menu[] =  [];
  currentModule : string = "Mission";

  constructor(private titleService : Title, private authGuard  : AuthGuard,private router : Router,
    private navigationService : HeaderNavigation) { 
    this.titleService.setTitle("Ambroise - "+this.currentModule);
    if(authGuard.isActivated()){ 
      for(let module of this.modules){
        if(module.roles.indexOf(authGuard.getRole()) > -1){
          this.displayedModules.push(module);
        }
      }
    }
  }

  ngOnInit() {
  }

  setCurrentModule(event){
    this.currentModule = (event.target.textContent != this.currentModule) ? event.target.textContent : this.currentModule;
    this.titleService.setTitle("Ambroise - "+this.currentModule);
  }

  accountClick(){
    if(this.authGuard.isActivated()){
      this.router.navigate(['']);
    }
    else{
      this.router.navigate(['content']);
    }
  }

}
