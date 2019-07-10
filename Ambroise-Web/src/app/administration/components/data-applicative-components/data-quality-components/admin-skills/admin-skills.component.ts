import { Component, OnInit, OnDestroy } from '@angular/core';
import { Skill } from 'src/app/administration/models/Skill';
import { MatTableDataSource, MatDialogConfig, MatDialog } from '@angular/material';
import { AdminSkillsSynonymousService } from 'src/app/administration/services/admin-skills-synonymous.service';
import { ProgressSpinnerComponent } from 'src/app/utils/progress-spinner/progress-spinner.component';
import { DataSkillDialogComponent } from '../../../modal-administation/data-skill-dialog/data-skill-dialog.component';
import { ErrorService } from 'src/app/services/error.service';

@Component({
  selector: 'app-admin-skills',
  templateUrl: './admin-skills.component.html',
  styleUrls: ['./admin-skills.component.scss']
})
export class AdminSkillsComponent implements OnInit , OnDestroy {

  // skill data 
  skills: Skill[];
  skillsSynonymous: Skill[];
  currentSkill: string[];
  skillsSources: MatTableDataSource<any[]> = new MatTableDataSource();
  skillsSynonymousSources: MatTableDataSource<any[]> = new MatTableDataSource();
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
    this.adminSkillService.getSkills().subscribe((skillsList: Skill[]) => {
      for (const skill of skillsList) {
        this.skills.push(new Skill(skill.name, skill.synonymous, skill.replaceWith));
      }
      // this.skills = skillsList;
      console.log("Skills : " + this.skills);
      this.skills.forEach(skill => {
        if (skill.getReplaceWith() != null || skill.getSynonymous() != null) {
          this.skillsSynonymous.push(skill);
          // console.log(skill);
        }
        console.log(skill.name);
      });
      this.skillsSources = new MatTableDataSource<any>(this.skills);
      this.skillsSynonymousSources = new MatTableDataSource<any>(this.skillsSynonymous);
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
          this.adminSkillService.updateSkillsSynonymous(skill).subscribe((response) => {
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
          this.adminSkillService.updateSkillsSynonymous(skill).subscribe((response) => {
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

    dialogConfig.data = {
      id: 1,
      title: 'Skill',
      description: 'Compétence',
      name: skill.name,
      synonymous: skill.synonymous,
      replaceWith: skill.replaceWith
    };

    return this.dialog.open(DataSkillDialogComponent, dialogConfig);
  }

}
