import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig, MatTableDataSource, MatTable } from '@angular/material';
import { DataAgencyDialogComponent } from 'src/app/administration/components/modal-administation/data-agency-dialog/data-agency-dialog.component';
import { DataUserManagementDialogComponent} from 'src/app/administration/components/modal-administation/data-user-management-dialog/data-user-management-dialog.component';
import { AdminService } from 'src/app/administration/services/admin.service';
import { ProgressSpinnerComponent } from 'src/app/utils/progress-spinner/progress-spinner.component';
import { SubMenusService } from 'src/app/services/subMenus.service';
import { Router } from '@angular/router';
import { SubMenu } from 'src/app/header/models/menu';
import { LoggerService, LogLevel } from 'src/app/services/logger.service';
import { SoftSkill } from '../../models/SoftSkill';
import { Agency } from '../../models/Agency';
import { User } from '../../models/User';
import { DataSoftSkillDialogComponent } from '../modal-administation/data-soft-skill-dialog/data-soft-skill-dialog.component';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ErrorService } from 'src/app/services/error.service';
import { UserRole } from 'src/app/administration/models/User' ; 
import { AdminGeoApiService } from '../../services/admin-geo-api.service';

@Component({
  selector: 'app-admin-data-app',
  templateUrl: './admin-data-app.component.html',
  styleUrls: ['./admin-data-app.component.scss']
})
export class AdminDataAppComponent implements OnInit, OnDestroy {
  submenusSubscription;

  constructor(
    private adminService: AdminService,
    private dialog: MatDialog,
    private subMenusService: SubMenusService,
    private router: Router,
    private errorService: ErrorService,
    private adminGeoApiService: AdminGeoApiService) {
  }

  ngOnInit() {
    this.createMenu();
    this.submenusSubscription = this.subMenusService.menuActionObservable.subscribe(action => this.doAction(action));
  }

  ngOnDestroy() {
    if (this.submenusSubscription !== undefined) {
      this.submenusSubscription.unsubscribe();
    } else {
      LoggerService.log('ERROR : SubMenusSubscription (Admin Data App) should have been set', LogLevel.DEV);
    }
  }

  onClickSynchroniseGeoApi() {
    const dialogProgress = ProgressSpinnerComponent.openDialogProgress(this.dialog);
    this.adminGeoApiService.updateGeoApi().subscribe((response) => {
      dialogProgress.close();
      this.errorService.handleResponse(response);
    });
    // TODO Attention, on a pas de moyen de savoir si une mise à jour à été faite sur la base distante
  }

  doAction(action: string) {
    if (action !== '') {
      const actionSplit = action.split('//');
      this.subMenusService.notifyMenuAction('');
      if (actionSplit[0] === this.router.url) {
        if (actionSplit[1].match('^redirect/.*')) {
          const redirect = actionSplit[1].substring(9);
          if (('/' + redirect) !== this.router.url + '/') {
            this.redirectAfterAction(redirect);
          }
        }
      }
    }
  }

  redirectAfterAction(redirect: string) {
    this.router.navigate([redirect]);
  }

  createMenu() {
    const subMenu: SubMenu[] = [];
    subMenu.push(this.subMenusService.createMenu('Documents', [], 'storage', 'redirect/admin/document', []));
    subMenu.push(this.subMenusService.createMenu('Données Applicatives', [], 'dashboard', 'redirect/admin/dataApp', []));
    this.subMenusService.notifySubMenu(subMenu);
  }
}

