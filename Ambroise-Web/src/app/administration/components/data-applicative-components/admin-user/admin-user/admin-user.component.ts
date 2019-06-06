import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { AdminUserService } from 'src/app/administration/services/admin-user.service';
import { User, UserRole } from 'src/app/administration/models/User';
import { MatTableDataSource, MatPaginator, MatDialog, MatDialogConfig } from '@angular/material';
import { ProgressSpinnerComponent } from 'src/app/utils/progress-spinner/progress-spinner.component';
import { ErrorService } from 'src/app/services/error.service';
import { DataUserManagementDialogComponent } from '../../../modal-administation/data-user-management-dialog/data-user-management-dialog.component';
import { DataUserUpdateDialogComponent } from '../../../modal-administation/data-user-update-dialog/data-user-update-dialog.component';

@Component({
  selector: 'app-admin-user',
  templateUrl: './admin-user.component.html',
  styleUrls: ['./admin-user.component.scss']
})
export class AdminUserComponent implements OnInit, OnDestroy {

  // Table
  userDataTable: MatTableDataSource<any[]> = new MatTableDataSource();
  displayedColumns: string[] = ['Nom', 'Prénom', 'Email', 'Rôle', 'Agence', 'Delete'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  users: User[] = [];

  constructor(private adminUserService: AdminUserService,
    private dialog: MatDialog,
    private errorService: ErrorService) { }

  ngOnInit() {
    this.fetchUsers();
  }

  ngOnDestroy() {
    this.dialog.closeAll();
  }

  fetchUsers() {
    this.adminUserService.getUsers().subscribe(users => this.createData(users as User[]));
  }

  createData(users: User[]) {
    let dataTable: any[] = [];
    if (users.length > 0) {
      this.users = users;
      users.forEach(user => {
        let tmpUser = {};
        tmpUser['Nom'] = user['name'];
        tmpUser['Prénom'] = user['forname'];
        tmpUser['Email'] = user['mail'];
        tmpUser['Rôle'] = user['role'];
        tmpUser['Agence'] = user['agency'];
        dataTable.push(tmpUser);
      });
      this.userDataTable = new MatTableDataSource(dataTable);
      this.userDataTable.paginator = this.paginator;
    }
  }

  addNewUser() {
    const user = new User('', '', '', UserRole.CONSULTANT, '');
    const dialogUser = this.openDialogUser(user);

    dialogUser.afterClosed().subscribe(
      (data: any) => {
        if (data) {
          const dialogProgress = ProgressSpinnerComponent.openDialogProgress(this.dialog);
          user.name = data.name;
          user.forname = data.forname;
          user.mail = data.mail;
          user.role = data.role;
          user.pswd = data.pswd;
          this.adminUserService.createUser(user).subscribe((response) => {
            this.fetchUsers();
            dialogProgress.close();
            this.errorService.handleResponse(response);
            this.fetchUsers();
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

  updateUser(updateUser) {
    const oldMail = updateUser.Email;
    const user = new User(updateUser.Nom, updateUser.Prénom, updateUser.Email, updateUser.Rôle, '');
    const dialogUser = this.openDialogUpdateUser(user);

    dialogUser.afterClosed().subscribe(
      (data: any) => {
        if (data) {
          const dialogProgress = ProgressSpinnerComponent.openDialogProgress(this.dialog);
          user.name = data.name;
          user.forname = data.forname;
          user.mail = data.mail;
          user.role = data.role;
          user.oldMail = oldMail;
          console.log(user.role);
          this.adminUserService.updateUser(user).subscribe((response) => {
            this.fetchUsers();
            dialogProgress.close();
            this.errorService.handleResponse(response);
            this.fetchUsers();
          });
        }
      });
  }

  openDialogUpdateUser(user) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.hasBackdrop = true;
    dialogConfig.direction = 'ltr';
    dialogConfig.closeOnNavigation = true;

    dialogConfig.data = {
      id: 1,
      title: 'User',
      description: 'UpdateUtilisateur',
      name: user.name,
      forName: user.forname,
      email: user.mail,
      role: user.role,
    };
    return this.dialog.open(DataUserUpdateDialogComponent, dialogConfig);

  }

  deleteUser(mail) {
    this.adminUserService.deleteUser(mail).subscribe((response) => {
      this.fetchUsers();
      this.errorService.handleResponse(response);
    });
  }

}
