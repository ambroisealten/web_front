import { Component, OnInit, OnDestroy } from '@angular/core';
import { Skill } from 'src/app/administration/models/Skill';
import { MatTableDataSource, MatDialogConfig, MatDialog } from '@angular/material';
import { AdminSkillsSynonymousService } from 'src/app/administration/services/admin-skills-synonymous.service';
import { ProgressSpinnerComponent } from 'src/app/utils/progress-spinner/progress-spinner.component';
import { DataSkillDialogComponent } from '../../../modal-administation/data-skill-dialog/data-skill-dialog.component';
import { ErrorService } from 'src/app/services/error.service';
import { stringify } from 'querystring';

@Component({
  selector: 'app-admin-skills',
  templateUrl: './admin-skills.component.html',
  styleUrls: ['./admin-skills.component.scss']
})
export class AdminSkillsComponent implements OnInit , OnDestroy {

  // skill data 
  skills: Skill[];
  currentSkill: string[];
  skillsSources: MatTableDataSource<any[]> = new MatTableDataSource();
  displayedSkillColumns: string[] = ['Nom', 'Synonymes', 'Remplacer par', 'Delete'];

  constructor(private adminSkillService: AdminSkillsSynonymousService,
    private dialog: MatDialog, 
    private errorService: ErrorService) { }

  ngOnInit() {
    this.fetchSkills() ; 
  }

  ngOnDestroy(){
    this.dialog.closeAll() ;
  }

  fetchSkills() {
    this.skills = [];
    this.adminSkillService.getSkillsSynonymous().subscribe((skillsList: Skill[]) => {
      this.skills = skillsList;
      this.skillsSources = new MatTableDataSource<any>(this.skills);
    });
  }

  removeSkill(skill: Skill) {
    const dialogProgress = ProgressSpinnerComponent.openDialogProgress(this.dialog);
    this.adminSkillService.deleteSkillsSynonymous(skill).subscribe((response) => {
      this.fetchSkills();
      dialogProgress.close();
      this.errorService.handleResponse(response);
    });
  }

  addSkill() {
    const skill = new Skill('', [''], '');
    const dialogSkill = this.openDialogSkill(skill);

    dialogSkill.afterClosed().subscribe(
      (data: any) => {
        if (data) {
          const dialogProgress = ProgressSpinnerComponent.openDialogProgress(this.dialog);
          this.adminSkillService.updateSkillsSynonymous(data).subscribe((response) => {
            this.fetchSkills();
            dialogProgress.close();
            this.errorService.handleResponse(response);
          });
        }
      });
  }

  changeSkill(skill: Skill) {
    const dialogSkill = this.openDialogSkill(skill);
    dialogSkill.afterClosed().subscribe(
      (data: any) => {
        if (data) {
          const dialogProgress = ProgressSpinnerComponent.openDialogProgress(this.dialog);
          this.adminSkillService.updateSkillsSynonymous(data).subscribe((response) => {
            this.fetchSkills();
            dialogProgress.close();
            this.errorService.handleResponse(response);
          });
        }
      });
  }

  openDialogSkill(skill: Skill) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.hasBackdrop = true;
    dialogConfig.direction = 'ltr';
    dialogConfig.closeOnNavigation = true;
    
    const tmpSynonymous = skill.synonymous.join();
    
    dialogConfig.data = {
      id: 1,
      title: 'Skill',
      description: 'Compétence',
      name: skill.name,
      synonymous: tmpSynonymous,
      replaceWith: skill.replaceWith
    };

    return this.dialog.open(DataSkillDialogComponent, dialogConfig);
  }

}
