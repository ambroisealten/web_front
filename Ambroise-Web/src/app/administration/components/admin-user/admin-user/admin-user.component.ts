import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { AdminUserService } from 'src/app/administration/services/admin-user.service';
import { User } from 'src/app/administration/models/User';
import { MatTableDataSource, MatPaginator } from '@angular/material';

@Component({
  selector: 'app-admin-user',
  templateUrl: './admin-user.component.html',
  styleUrls: ['./admin-user.component.scss']
})
export class AdminUserComponent implements OnInit, OnDestroy {

  // Table
  userDataTable: MatTableDataSource<any[]> = new MatTableDataSource();
  displayedColumns: string[] = ['Nom Prénom', 'Rôle', 'Agence'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  users: User[] = [] ; 

  constructor(private adminUserService: AdminUserService) { }

  ngOnInit() {
    this.adminUserService.getUsers().subscribe(users => this.createData(users))  ; 
  }

  ngOnDestroy(){

  }

  createData(users: User[]){
    let dataTable: any[] = [] ; 
    if(users.length > 0 ){
      this.users = users ; 
      users.forEach(user => {
        let tmpUser = {} ; 
        tmpUser['Nom Prénom'] = user['name'] + ' ' + user['forname'] ;
        tmpUser['Rôle'] = user['role'] ; 
        tmpUser['Agence'] = user['agency'] ; 
        dataTable.push(tmpUser) ; 
      });
      this.userDataTable = new MatTableDataSource(dataTable) ; 
      this.userDataTable.paginator = this.paginator ; 
    }
  }

  
}
