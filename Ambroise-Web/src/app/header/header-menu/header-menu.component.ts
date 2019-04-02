import { Component, OnInit } from '@angular/core';
import { HeaderNavigation } from 'src/app/services/navigation.services';

@Component({
    selector: 'app-header-menu',
    templateUrl: './header-menu.component.html',
    styleUrls: ['./header-menu.component.scss']
})
export class HeaderMenuComponent implements OnInit {

    modules : any //Objet JSON contenant la liste des modules/menus/sous-menus (stocké en dur dans navigationService atm)

    constructor(private navigationService: HeaderNavigation) {
        this.modules = this.navigationService.getModules();
    }

    ngOnInit() {
    }

    getCurrentModule()
    {
        //console.log("Mpouhahaha");
        return this.navigationService.getCurrentModule();
    }

}
