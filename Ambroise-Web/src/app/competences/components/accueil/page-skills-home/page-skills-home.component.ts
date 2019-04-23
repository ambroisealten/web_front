import { Component, OnInit } from '@angular/core';
import { ModalSkillsCandidateComponent } from 'src/app/competences/components/accueil/modal-skills-candidate/modal-skills-candidate.component';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { LoggerService, LogLevel } from 'src/app/services/logger.service';
import { Router, NavigationExtras } from '@angular/router';
import { SkillsSheetService } from 'src/app/competences/services/skillsSheet.service';
import { PersonRole, Person } from 'src/app/competences/models/person';
import { PersonSkillsService } from 'src/app/competences/services/personSkills.service';
import { SkillsSheet } from 'src/app/competences/models/skillsSheet';
import { SkillsService } from 'src/app/competences/services/skills.service';
import { Skills } from 'src/app/competences/models/skills';

@Component({
  selector: 'app-page-skills-home',
  templateUrl: './page-skills-home.component.html',
  styleUrls: ['./page-skills-home.component.scss']
})
export class PageSkillsHomeComponent implements OnInit {

  constructor(private dialog: MatDialog, 
    private router: Router, 
    private skillsSheetService: SkillsSheetService, 
    private personSkillsService: PersonSkillsService,
    private skillsServie: SkillsService) { }

  ngOnInit() {
  }

  /**
  * Create a new applicant with his skillsSheet
  * Temporary function here, will be in header menu or home page
  */
  createCandidateModal() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;

    const dialogRef = this.dialog.open(ModalSkillsCandidateComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(newPerson => {
      if(newPerson != undefined)
      {
        this.personSkillsService.createNewPerson(newPerson).subscribe(httpResponse => {
          if(httpResponse != undefined) {
            this.skillsSheetService.getAllSkillSheets().subscribe(skillSheetsListData => this.checkNameUnicity(skillSheetsListData,newPerson));
          }
        });
      }
    });
  }

  checkNameUnicity(skillSheetsListData,person){
    let date = String("0" + (new Date().getMonth()+1)).slice(-2) + new Date().getFullYear();
    let trigramme = person.name.substring(0,1) + person.surname.substring(0,2);
    let tmpSkillsSheetName =  date + '-' + trigramme;
    tmpSkillsSheetName = tmpSkillsSheetName.toUpperCase() ;
    let skillSheetsList: SkillsSheet[];
    let skillSheetsNamesList = [];
    if(skillSheetsListData != undefined) {
      skillSheetsList = skillSheetsListData as SkillsSheet[];
      skillSheetsList.forEach(skillsSheet => {
        skillSheetsNamesList.push(skillsSheet.name);
      });
 
      let i = 1;
      while(skillSheetsNamesList.indexOf(tmpSkillsSheetName.toUpperCase()) != -1) {
        trigramme = trigramme.substring(0,2) + i.toString();
        tmpSkillsSheetName =  date + '-' + trigramme;
        i++;
      }
    }
    let currentSkillsSheet = new SkillsSheet(tmpSkillsSheetName.toUpperCase(),person)
    this.skillsSheetService.createNewSkillsSheet(currentSkillsSheet).subscribe(httpResponse => {
      if(httpResponse != undefined) {
        this.skillsServie.notifySkills(new Skills(person,currentSkillsSheet));
        this.redirectToSkillsSheet() ; 
      }
    })

  }

  redirectToSkillsSheet() {
    this.router.navigate(['skills/skillsheet']);
  }

}
