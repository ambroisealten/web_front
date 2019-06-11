import { Component, OnInit, OnDestroy } from '@angular/core';
import { Agency } from 'src/app/administration/models/Agency';
import { MatTableDataSource, MatDialogConfig, MatDialog } from '@angular/material';
import { AdminAgencyService } from 'src/app/administration/services/admin-agency.service';
import { ProgressSpinnerComponent } from 'src/app/utils/progress-spinner/progress-spinner.component';
import { DataAgencyDialogComponent } from '../../../modal-administation/data-agency-dialog/data-agency-dialog.component';
import { ErrorService } from 'src/app/services/error.service';

@Component({
  selector: 'app-agencies',
  templateUrl: './agencies.component.html',
  styleUrls: ['./agencies.component.scss']
})
export class AgenciesComponent implements OnInit, OnDestroy {

  // agency data 
  agencies: Agency[];
  currentAgency: string[];
  agenciesSources: MatTableDataSource<any[]> = new MatTableDataSource();
  displayedAgencyColumns: string[] = ['Nom', 'Lieu', 'Type de lieu', 'Delete'];

  constructor(private adminAgencyService: AdminAgencyService,
    private dialog: MatDialog,
    private errorService: ErrorService) { }

  ngOnInit() {
    this.fetchAgencies();
  }

  ngOnDestroy() {
    this.dialog.closeAll();
  }

  fetchAgencies() {
    this.agencies = [];
    this.adminAgencyService.getAgencies().subscribe((agenciesList: Agency[]) => {
      this.agencies = agenciesList;
      this.agencies.forEach(agency => {
        switch (agency.placeType) {
          case ('region'): agency['Type de Lieu'] = "Région";
            break;
          case('city'): agency['Type de Lieu'] = "Ville";
            break ; 
          case('departement'): agency['Type de Lieu'] = "Département";
            break ; 
          default: 
            break ; 
        }
      })
      this.agenciesSources = new MatTableDataSource<any>(this.agencies)
    });
  }

  removeAgency(agency: Agency) {
    const dialogProgress = ProgressSpinnerComponent.openDialogProgress(this.dialog);
    this.adminAgencyService.deleteAgency(agency).subscribe((response) => {
      this.fetchAgencies();
      dialogProgress.close();
      this.errorService.handleResponse(response);
    });
  }

  addAgency() {
    const agency = new Agency('', '', '');
    const dialogAgency = this.openDialogAgency(agency);

    dialogAgency.afterClosed().subscribe(
      (data: any) => {
        if (data) {
          const dialogProgress = ProgressSpinnerComponent.openDialogProgress(this.dialog);
          this.switchPlaceType(data) ; 
          this.adminAgencyService.createAgency(data).subscribe((response) => {
            this.fetchAgencies();
            dialogProgress.close();
            this.errorService.handleResponse(response);
          });
        }
      });
  }

  changeAgency(agency: Agency) {
    const dialogAgency = this.openDialogAgency(agency);
    dialogAgency.afterClosed().subscribe(
      (data: any) => {
        if (data) {
          const dialogProgress = ProgressSpinnerComponent.openDialogProgress(this.dialog);
          data['oldName'] = agency.name;
          if (data['placeType'] == null) {
            data['placeType'] = agency.placeType;
          }
          this.switchPlaceType(data) ; 
          this.adminAgencyService.updateAgency(data).subscribe((response) => {
            this.fetchAgencies();
            dialogProgress.close();
            this.errorService.handleResponse(response);
          });
        }
      });
  }

  openDialogAgency(agency: Agency) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.hasBackdrop = true;
    dialogConfig.direction = 'ltr';
    dialogConfig.closeOnNavigation = true;

    dialogConfig.data = {
      id: 1,
      title: 'Agency',
      description: 'Agence',
      name: agency.name,
      place: agency.place
    };

    return this.dialog.open(DataAgencyDialogComponent, dialogConfig);
  }

  switchPlaceType(data){
    switch (data.placeType) {
      case ('Région'): data.placeType = "region";
        break;
      case('Ville'): data.placeType = "city" ; 
        break ; 
      case('Département'): data.placeType = "departement"
        break ; 
      default: 
        break ; 
    }
  }
}
