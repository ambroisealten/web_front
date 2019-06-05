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

@Component({
  selector: 'app-admin-data-app',
  templateUrl: './admin-data-app.component.html',
  styleUrls: ['./admin-data-app.component.scss']
})
export class AdminDataAppComponent implements OnInit, OnDestroy {

  //Subscriptions
  submenusSubscription;

  // User data 
  users: User[];
  usersSources: MatTableDataSource<any[]> = new MatTableDataSource();
  displayedUserColumns: string[] = ['Nom', 'Prénom', 'Email', 'Mot de passe', 'rôle', 'Delete'];

  constructor(
    private adminService: AdminService,
    private dialog: MatDialog,
    private subMenusService: SubMenusService,
    private router: Router,
    private errorService: ErrorService) {
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

  getUser() {
    return this.users;
  }

  fetchUsers() {
    this.users = [];
    this.adminService.makeRequest('/admin/users', 'get', '').subscribe((usersList: User[]) => {
      for (const user of usersList) {
        this.users.push(new User(user.name, user.forname, user.mail, user.role));
      }
      this.usersSources = new MatTableDataSource<any>(this.users)
    });
  }

  onClickSynchroniseGeoApi() {
    const dialogProgress = ProgressSpinnerComponent.openDialogProgress(this.dialog);
    this.adminService.makeRequest('/admin/synchronize/geographics', 'post', '').subscribe((response) => {
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


  addNewUser() {
    const user = new User('', '', '',UserRole.CONSULTANT);
    const dialogUser = this.openDialogUser(user);

    dialogUser.afterClosed().subscribe(
      (data: any) => {
        if (data) {
          const dialogProgress = ProgressSpinnerComponent.openDialogProgress(this.dialog);
          user.name = data.name
          user.forname = data.forname
          user.mail = data.mail
          user.role = data.role
          const postParams = {
            name: user.name,
            forName: user.forname, 
            mail: user.mail,
            role: user.role
          };
          this.adminService.makeRequest('/user', 'post', postParams).subscribe((response) => {
            this.fetchUsers();
            dialogProgress.close();
            this.errorService.handleResponse(response);
          });
        }
      });
  }

  openDialogUser(user: User) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.hasBackdrop = true;
    dialogConfig.direction = 'ltr';
    dialogConfig.closeOnNavigation = true;

    dialogConfig.data = {
      id: 1,
      title: 'User',
      description: 'Utilisateur',
      name: user.name,
      forName: user.forname,
      email: user.mail,
      role: user.role,
    };

    return this.dialog.open(DataUserManagementDialogComponent, dialogConfig);
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

