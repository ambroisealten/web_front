import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DataAgencyDialogComponent } from 'src/app/administration/components/data-agency-dialog/data-agency-dialog.component';
import { AdminService } from 'src/app/administration/services/admin.service';
import { Agency } from '../../models/Agency';
import { ProgressSpinnerComponent } from 'src/app/utils/progress-spinner/progress-spinner.component';
import { SubMenusService } from 'src/app/services/subMenus.service';
import { Router } from '@angular/router';
import { SubMenu } from 'src/app/header/models/menu';
import { LoggerService, LogLevel } from 'src/app/services/logger.service';

@Component({
  selector: 'app-admin-data-app',
  templateUrl: './admin-data-app.component.html',
  styleUrls: ['./admin-data-app.component.scss']
})
export class AdminDataAppComponent implements OnInit, OnDestroy {
  agencies: Agency[];
  submenusSubscription;

  constructor(
    private adminService: AdminService,
    private dialog: MatDialog,
    private subMenusService: SubMenusService,
    private router: Router) {
  }

  ngOnInit() {
    this.createMenu();
    this.submenusSubscription = this.subMenusService.menuActionObservable.subscribe(action => this.doAction(action));
    this.fetchAgencies();
  }

  ngOnDestroy() {
    if (this.submenusSubscription !== undefined) {
      this.submenusSubscription.unsubscribe();
    } else {
      LoggerService.log('ERROR : SubMenusSubscription (Admin Data App) should have been set', LogLevel.DEV);
    }
  }

  getAgencies() {
    return this.agencies;
  }

  fetchAgencies() {
    this.agencies = [];
    this.adminService.makeRequest('agencies', 'get', '', (data: string) => {
      const agenciesFetched = JSON.parse(data);
      for (const agency of agenciesFetched) {
        this.agencies.push(new Agency(agency.name, agency.place, agency.placeType));
      }
    });
  }

  onClickSynchroniseGeoApi() {
    const dialogProgress = ProgressSpinnerComponent.openDialogProgress(this.dialog);
    this.adminService.makeRequest('admin/synchronize/geographics', 'post', '', '').subscribe(() => {
      dialogProgress.close();
    });
    // TODO Attention, on a pas de moyen de savoir si une mise à jour à été faite sur la base distante
  }

  removeAgency(agency: Agency) {
    const dialogProgress = ProgressSpinnerComponent.openDialogProgress(this.dialog);
    const postParams = {
      name: agency.getName(),
      place: agency.getPlace(),
      placeType: agency.getPlaceType()
    };
    this.adminService.makeRequest('agency', 'delete', postParams, '').subscribe(() => {
      dialogProgress.close();
    });
  }

  addAgency() {
    const agency = new Agency('', '', '');
    const dialogAgency = this.openDialogAgency(agency);

    dialogAgency.afterClosed().subscribe(
      (data: any) => {
        if (data) {
          const dialogProgress = ProgressSpinnerComponent.openDialogProgress(this.dialog);
          agency.setName(data.name);
          agency.setPlace(data.place);
          agency.setPlaceType(data.placeType);
          const postParams = {
            name: agency.getName(),
            place: agency.getPlace(),
            placeType: agency.getPlaceType()
          };
          this.adminService.makeRequest('agency', 'post', postParams, '').subscribe(() => {
            dialogProgress.close();
          });
          this.fetchAgencies();
          window.location.reload();
        }
      });
  }

  updateAgency(agency: Agency) {
    const dialogAgency = this.openDialogAgency(agency);

    dialogAgency.afterClosed().subscribe(
      (data: any) => {
        if (data) {
          const dialogProgress = ProgressSpinnerComponent.openDialogProgress(this.dialog);
          const previousName = agency.getName();
          agency.setName(data.name);
          agency.setPlace(data.place);
          agency.setPlaceType(data.placeType);
          const postParams = {
            oldName: previousName,
            name: agency.getName(),
            place: agency.getPlace(),
            placeType: agency.getPlaceType()
          };
          this.adminService.makeRequest('agency', 'put', postParams, '').subscribe(() => {
            dialogProgress.close();
          });
          this.fetchAgencies();
          window.location.reload();
        }
      });
  }

  openDialogAgency(agency: Agency) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.hasBackdrop = true;
    dialogConfig.direction = 'ltr';
    dialogConfig.closeOnNavigation = true;

    dialogConfig.data = {
      id: 1,
      title: 'Agency edition',
      description: 'Agency edition',
      name: agency.getName(),
      place: agency.getPlace()
    };

    return this.dialog.open(DataAgencyDialogComponent, dialogConfig);
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
