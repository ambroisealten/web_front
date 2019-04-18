import { Component, OnInit } from '@angular/core';
import { ModalSkillsCandidateComponent } from 'src/app/competences/components/accueil/modal-skills-candidate/modal-skills-candidate.component';
import { MatDialogConfig, MatDialog, MatTableDataSource } from '@angular/material';
import { LoggerService, LogLevel } from 'src/app/services/logger.service';
import { Router } from '@angular/router';
import { SkillsSheetService } from 'src/app/competences/services/skillsSheet.service';
import { Person } from 'src/app/competences/models/person';
import { PersonSkillsService } from 'src/app/competences/services/personSkills.service';
import { SkillsSheet } from 'src/app/competences/models/skillsSheet';

@Component({
  selector: 'app-page-skills-home',
  templateUrl: './page-skills-home.component.html',
  styleUrls: ['./page-skills-home.component.scss']
})
export class PageSkillsHomeComponent implements OnInit {

  skillsSheetDataSource: MatTableDataSource<SkillsSheet>;
  displayedColumns: string[] = ['Mail', 'Nom fiche'];

  constructor(private dialog: MatDialog, private router: Router, private skillsSheetService: SkillsSheetService, private personSkillsService: PersonSkillsService) { }

  ngOnInit() {
    this.skillsSheetService.getAllSkillSheets().subscribe(skillsSheetList => {
      this.skillsSheetDataSource = new MatTableDataSource(skillsSheetList as SkillsSheet[]);
    })
  }

  initDataSource(skillsSheetsList) {
    let skillsSheets = skillsSheetsList;
    let personsList: Person[] = [];

    skillsSheets.forEach(sheet => {
      if(sheet != undefined) {
        this.personSkillsService.getPersonByMail(sheet.mailPersonAttachedTo, sheet.role).subscribe(currPerson => {
          let ah = currPerson as Person;
          console.log(ah.surname);
        })
      }
    });
  }

  /**
  * Filters array on input
  * @param  filterValue input string
  */
  applyFilterSkillsSheets(filterValue: string) {
    this.skillsSheetDataSource.filter = filterValue.trim().toLowerCase();
  }

  navigateToSkillsSheet(skillsSheetData) {
    this.personSkillsService.getPersonByMail(skillsSheetData.mailPersonAttachedTo, skillsSheetData.role).subscribe(currPerson => {
      let ah = currPerson as Person;
      console.log(ah.surname);
    });
    console.log(skillsSheetData);
  }

  /**
  * Create a new applicant/consultant with his skillsSheet
  * Temporary function here, will be in header menu or home page
  */
  createSkillsSheetModal() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;

    const dialogRef = this.dialog.open(ModalSkillsCandidateComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(newPerson => {
      if(newPerson != undefined)
      {
        this.personSkillsService.createNewPerson(newPerson).subscribe(httpResponse => {
          if(httpResponse != undefined) {
            this.hasToRedirect(newPerson);
          }
        });
      }
    });
  }

  hasToRedirect(person: {} | Person){
    if(person != undefined){
      this.personSkillsService.notifyPersoninformation(person);
      this.redirectToSkillsSheet();
    }
  }

  redirectToSkillsSheet() {
    this.router.navigate(['skills/skillsheet']);
  }

}
