import { Component, ViewChild, ComponentFactoryResolver, ViewContainerRef} from '@angular/core';
import { LoggerService } from './services/logger.service';
import { environment } from 'src/environments/environment';
import { IsNotLoginService } from './services/isNotLogin.service';
import { HeaderUserComponent } from './header/components/header-user/header-user.component';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SubMenusService } from './services/subMenus.service';
import { Menu } from './header/models/menu';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @ViewChild('headerHost', { read: ViewContainerRef }) entry: ViewContainerRef;
  componentRef: any ;
  previousRoute: any = "" ;
  title = 'Ambroise-Web';

  constructor(private isNotLoginService: IsNotLoginService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private router: Router,
    private subMenusService: SubMenusService){
    //  Récupération de la variable d'environement "globalLogType" pour initialiser
    //  le LoggerService
    LoggerService.parseLogType(environment.globalLogType);
    const helmet = require('helmet')
  }

  ngOnInit(){
    this.isNotLoginService.inLoginObservable.subscribe(isNotLogin => this.handleHeader(isNotLogin));
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(({urlAfterRedirects}: NavigationEnd) => {
        this.clearSkillsSheetStorage(urlAfterRedirects) ;
      });
  }

  clearSkillsSheetStorage(urlAfterRedirects: string){
    if(this.previousRoute.includes("skills/skillsheet") && !urlAfterRedirects.includes("skills/skillsheet")){
      window.sessionStorage.removeItem('skills') ;
      window.sessionStorage.removeItem('person') ;
      window.sessionStorage.removeItem('skillsSheetVersions') ;
      this.subMenusService.notifySubMenu([]);
    }
    this.previousRoute = urlAfterRedirects ;
  }
  handleHeader(isNotLogin:boolean){
    if(!isNotLogin){
      try{
        this.componentRef.destroy() ;
      } catch(e) {
      }
    } else {
      this.entry.clear() ;
      let componentFactory = this.componentFactoryResolver.resolveComponentFactory(HeaderUserComponent) ;
      this.componentRef = this.entry.createComponent(componentFactory) ;
    }
  }

}
