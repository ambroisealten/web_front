import { Component, OnInit, OnDestroy } from '@angular/core';
import { SoftSkill } from 'src/app/administration/models/SoftSkill';
import { MatTableDataSource, MatDialogConfig, MatDialog } from '@angular/material';
import { AdminSoftSkillService } from 'src/app/administration/services/admin-softSkill.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ProgressSpinnerComponent } from 'src/app/utils/progress-spinner/progress-spinner.component';
import { DataSoftSkillDialogComponent } from '../../../modal-administation/data-soft-skill-dialog/data-soft-skill-dialog.component';
import { ErrorService } from 'src/app/services/error.service';

@Component({
  selector: 'app-admin-soft-skill',
  templateUrl: './admin-soft-skill.component.html',
  styleUrls: ['./admin-soft-skill.component.scss']
})
export class AdminSoftSkillComponent implements OnInit, OnDestroy {

  // SoftSkill data 
  softSkills: SoftSkill[];
  softSkillsSources: MatTableDataSource<any[]> = new MatTableDataSource();
  displayedsoftSkillsColumns: string[] = ['Nom', 'Delete'];

  constructor(private adminSoftSkillService: AdminSoftSkillService,
    private dialog: MatDialog,
    private errorService: ErrorService) { }

  ngOnInit() {
    this.fetchSoftSkills() ; 
  }

  ngOnDestroy(){

  }


  fetchSoftSkills() {
    this.softSkills = [];
    this.adminSoftSkillService.getSoftSkills().subscribe((softSkillList: SoftSkill[]) => {
      this.softSkills = softSkillList ; 
      this.softSkills.sort((e1, e2) => e1.order - e2.order);
      this.softSkillsSources = new MatTableDataSource<any>(this.softSkills);
      window.sessionStorage.setItem('softSkills', JSON.stringify(this.softSkills));
    });

  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.saveSoftSkillsOrder(event.container.data);
    }
  }


  saveSoftSkillsOrder(dropList: any[]) {
    const dialogProgress = ProgressSpinnerComponent.openDialogProgress(this.dialog);
    const finalList = [];
    let order = 0;
    for (let i = 0; i < dropList.length; i++) {
      order++;
      const child = dropList[i];
      child.order = order ;
      finalList.push(child);
    }
    if (finalList.length === 0) {
      const ok = confirm('Êtes-vous sûr de ne vouloir mettre aucune compétence Soft dans la base de données ?');
      if (!ok) {
        return;
      }
    }

    this.adminSoftSkillService.updateSoftSkillsOrder(finalList).subscribe((responses: any[]) => {
      this.fetchSoftSkills();
      dialogProgress.close();
      this.errorService.handleResponses(responses, 200);
    });
  }

  removeSoftSkill(softSkill: SoftSkill) {
    const dialogProgress = ProgressSpinnerComponent.openDialogProgress(this.dialog);
    this.adminSoftSkillService.deleteSoftSkill(softSkill).subscribe((response) => {
      this.fetchSoftSkills();
      dialogProgress.close();
      this.errorService.handleResponse(response);
    });
  }

  addSoftSkill() {
    const softSkill = new SoftSkill('', this.softSkills.length + 1);
    const dialogSoftSkill = this.openDialogSoftSkill(softSkill);

    dialogSoftSkill.afterClosed().subscribe(
      (data: any) => {
        if (data) {
          const dialogProgress = ProgressSpinnerComponent.openDialogProgress(this.dialog);
          softSkill.setName(data.name);
          this.adminSoftSkillService.createSoftSkill(softSkill).subscribe((response) => {
            this.fetchSoftSkills();
            dialogProgress.close();
            this.errorService.handleResponse(response);
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
          const previousName = softSkill.name ; 
          softSkill.setName(data.name);
          this.adminSoftSkillService.updateSoftSkill(softSkill).subscribe((response) => {
            this.fetchSoftSkills();
            dialogProgress.close();
            this.errorService.handleResponse(response);
          });
        }
      });
  }

  openDialogSoftSkill(softSkill: SoftSkill) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.hasBackdrop = true;
    dialogConfig.direction = 'ltr';
    dialogConfig.closeOnNavigation = true;

    dialogConfig.data = {
      id: 1,
      title: 'Soft Skill',
      description: 'Soft Skill',
      name: softSkill.name,
    };

    return this.dialog.open(DataSoftSkillDialogComponent, dialogConfig);
  }
}
