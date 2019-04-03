import { Component, OnInit } from '@angular/core';
import { HeaderNavigation } from 'src/app/services/navigation.services';

@Component({
    selector: 'app-header-menu',
    templateUrl: './header-menu.component.html',
    styleUrls: ['./header-menu.component.scss']
})
export class HeaderMenuComponent implements OnInit {

    modules: any;

    constructor(private navigationService: HeaderNavigation) {
        this.getMenus();
    }

    ngOnInit() {
    }

    getCurrentModule() {
        return this.navigationService.getCurrentModule();
    }

    getMenus() {

        let tmpModules: any;
        this.navigationService.getModulesFromService((tmp) => {
            tmpModules = JSON.parse(tmp);
            this.modules=tmpModules.modules;
        });
    }
}
