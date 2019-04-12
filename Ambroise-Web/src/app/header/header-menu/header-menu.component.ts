import { Component, OnInit } from '@angular/core';
import { HeaderService } from 'src/app/services/header.services';
import { LoggerService, LogLevel } from 'src/app/services/logger.service';

@Component({
    selector: 'app-header-menu',
    templateUrl: './header-menu.component.html',
    styleUrls: ['./header-menu.component.scss']
})
export class HeaderMenuComponent implements OnInit {

    modules: any;
    private done = false

    constructor(private headerService: HeaderService) { }

    ngOnInit() {
        this.headerService.init();
        this.headerService.menuReceptionObservable.subscribe(menusReceived => {
            LoggerService.log("menus received in header-menu: " + menusReceived, LogLevel.DEBUG);
            if (menusReceived != undefined && !this.done) {
                this.modules = menusReceived.modules;
                this.done=true;
            }
        })
    }

    getCurrentModule() {
        return this.headerService.getCurrentModuleFromService();
    }

}
