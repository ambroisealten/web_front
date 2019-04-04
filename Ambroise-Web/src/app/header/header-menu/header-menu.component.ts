import { Component, OnInit } from '@angular/core';
import { HeaderService } from 'src/app/services/header.services';

@Component({
    selector: 'app-header-menu',
    templateUrl: './header-menu.component.html',
    styleUrls: ['./header-menu.component.scss']
})
export class HeaderMenuComponent implements OnInit {

    modules: any;

    constructor(private headerService: HeaderService) {
        this.getMenus();
    }

    ngOnInit() {
    }

    getCurrentModule() {
        return this.headerService.getCurrentModuleFromService();
    }

    getMenus() {

        let tmpModules: any;
        this.headerService.getModulesFromService((tmp) => {
            tmpModules = JSON.parse(tmp);
            this.modules=tmpModules.modules;
        });
    }
}
