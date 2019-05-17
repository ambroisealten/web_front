import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { LoggerService, LogLevel } from 'src/app/services/logger.service';
import { SubMenu } from '../../models/menu';
import { Router } from '@angular/router';
import { SubMenusService } from 'src/app/services/subMenus.service';

@Component({
    selector: 'app-header-menu',
    templateUrl: './header-menu.component.html',
    styleUrls: ['./header-menu.component.scss']
})
export class HeaderMenuComponent implements OnInit {

    subMenus: SubMenu[] = [];

    //Subscription
    subMenusSubscription;

    constructor(
        private router: Router,
        private subMenusService: SubMenusService) { }

    ngOnInit() {
        this.subMenusSubscription = this.subMenusService.subMenuObservable.subscribe(subMenus => this.setSubMenus(subMenus))
    }

    ngOnDestroy() {
        if (this.subMenusSubscription != undefined) {
            this.subMenusSubscription.unsubscribe();
        } else {
            LoggerService.log("Oups ! Something went Wrong ! Subscription Header Menu failed", LogLevel.DEV)
        }
    }

    setSubMenus(subMenus: SubMenu[]) {
        if (subMenus != null && subMenus.length > 0) {
            this.subMenus = subMenus
        } else {
            this.subMenus = [];
        }
    }

    sendAction(action: string) {
        this.subMenusService.notifyMenuAction(this.router.url + "//" + action);
    }

}
