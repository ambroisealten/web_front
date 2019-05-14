import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DataAgencyDialogComponent } from 'src/app/administration/components/data-agency-dialog/data-agency-dialog.component';
import { AdminService } from 'src/app/administration/services/admin.service';
import { ProgressSpinnerComponent } from 'src/app/utils/progress-spinner/progress-spinner.component';
import { SubMenusService } from 'src/app/services/subMenus.service';
import { Router } from '@angular/router';
import { SubMenu } from 'src/app/header/models/menu';
import { LoggerService, LogLevel } from 'src/app/services/logger.service';
import { SoftSkill } from '../../models/SoftSkill';
import { Agency } from '../../models/Agency';
import { DataSoftSkillDialogComponent } from '../data-soft-skill-dialog/data-soft-skill-dialog.component';

@Component({
  selector: 'app-admin-data-app',
  templateUrl: './admin-data-app.component.html',
  styleUrls: ['./admin-data-app.component.scss']
})
export class AdminDataAppComponent implements OnInit, OnDestroy {
  agencies: Agency[];
  softSkills: SoftSkill[];
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
    this.fetchSoftSkills();
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
    this.adminService.makeRequest('agencies', 'get', '').subscribe((agenciesList: Agency[]) => {
      for (const agency of agenciesList) {
        this.agencies.push(new Agency(agency.name, agency.place, agency.placeType));
      }
    });
  }

  getSoftSkills() {
    console.log(this.softSkills);
    return this.softSkills;
  }

  fetchSoftSkills() {
    this.softSkills = [];
    this.adminService.makeRequest('softskills', 'get', '').subscribe((softSkillList: SoftSkill[]) => {
      for (const softSkill of softSkillList) {
        this.softSkills.push(new SoftSkill(softSkill.name));
      }
    });
  }

  onClickSynchroniseGeoApi() {
    const dialogProgress = ProgressSpinnerComponent.openDialogProgress(this.dialog);
    this.adminService.makeRequest('admin/synchronize/geographics', 'post', '').subscribe(() => {
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
    this.adminService.makeRequest('agency', 'delete', postParams).subscribe(() => {
      this.fetchAgencies();
      dialogProgress.close();
    });
  }

  removeSoftSkill(softSkill: SoftSkill) {
    const dialogProgress = ProgressSpinnerComponent.openDialogProgress(this.dialog);
    const postParams = {
      name: softSkill.getName(),
    };
    this.adminService.makeRequest('skill', 'delete', postParams).subscribe(() => {
      this.fetchSoftSkills();
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
          this.adminService.makeRequest('agency', 'post', postParams).subscribe(() => {
            this.fetchAgencies();
            dialogProgress.close();
          });
        }
      });
  }

  addSoftSkill() {
    const softSkill = new SoftSkill('');
    const dialogSoftSkill = this.openDialogSoftSkill(softSkill);

    dialogSoftSkill.afterClosed().subscribe(
      (data: any) => {
        if (data) {
          const dialogProgress = ProgressSpinnerComponent.openDialogProgress(this.dialog);
          softSkill.setName(data.name);
          const postParams = {
            name: softSkill.name,
            isSoft: softSkill.isSoft,
          };
          this.adminService.makeRequest('skill', 'post', postParams).subscribe(() => {
            this.fetchSoftSkills();
            dialogProgress.close();
          });
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
          this.adminService.makeRequest('agency', 'put', postParams).subscribe(() => {
            this.fetchAgencies();
            dialogProgress.close();
          });
        }
      });
  }

  updateSoftSkill(softSkill: SoftSkill) {
    const dialogSoftSkill = this.openDialogSoftSkill(softSkill);

    dialogSoftSkill.afterClosed().subscribe(
      (data: any) => {
        if (data) {
          const dialogProgress = ProgressSpinnerComponent.openDialogProgress(this.dialog);
          const previousName = softSkill.getName();
          softSkill.setName(data.name);
          const postParams = {
            oldName: previousName,
            name: softSkill.getName(),
            isSoft: softSkill.getIsSoft(),
          };
          this.adminService.makeRequest('skill', 'put', postParams).subscribe(() => {
            this.fetchSoftSkills();
            dialogProgress.close();
          });
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

  openDialogSoftSkill(softSkill: SoftSkill) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.hasBackdrop = true;
    dialogConfig.direction = 'ltr';
    dialogConfig.closeOnNavigation = true;

    dialogConfig.data = {
      id: 1,
      title: 'Soft Skill edition',
      description: 'Soft Skill edition',
      name: softSkill.getName(),
    };

    return this.dialog.open(DataSoftSkillDialogComponent, dialogConfig);
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
