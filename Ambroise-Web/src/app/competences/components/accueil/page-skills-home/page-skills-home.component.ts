import { Component, OnInit } from '@angular/core';
import { ModalSkillsCandidateComponent } from 'src/app/competences/components/accueil/modal-skills-candidate/modal-skills-candidate.component';
import { MatDialogConfig, MatDialog, MatTableDataSource } from '@angular/material';
import { LoggerService, LogLevel } from 'src/app/services/logger.service';
import { Router } from '@angular/router';
import { SkillsSheetService } from 'src/app/competences/services/skillsSheet.service';
import { Person, PersonRole } from 'src/app/competences/models/person';
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
      let tmpSkillsSheetList = skillsSheetList as SkillsSheet[];
      tmpSkillsSheetList.forEach(sheet => {
        if(sheet != undefined) {
          this.personSkillsService.getPersonByMail(sheet.mailPersonAttachedTo, sheet.rolePersonAttachedTo).subscribe(currPerson => {
            if(currPerson != undefined) {
              let tmpPerson = currPerson as Person;
              // TODO update datasource with person information + separate methods for subscribe
          }
        });
      }
      });
    })
  }

  initDataSource(skillsSheetsList) {
    let skillsSheets = skillsSheetsList as SkillsSheet[];
    let personsList: Person[] = [];
  }

  /**
  * Filters array on input
  * @param  filterValue input string
  */
  applyFilterSkillsSheets(filterValue: string) {
    this.skillsSheetDataSource.filter = filterValue.trim().toLowerCase();
  }

  navigateToSkillsSheet(skillsSheetData) {
    console.log(skillsSheetData);

    this.skillsSheetService.notifySkillsSheetinformation(skillsSheetData);
    this.redirectToSkillsSheet();
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
    let currentSkillsSheet = new SkillsSheet(tmpSkillsSheetName,person)
    this.skillsSheetService.createNewSkillsSheet(currentSkillsSheet).subscribe(httpResponse => {
      if(httpResponse != undefined) {
        this.skillsSheetService.notifySkillsSheetinformation(currentSkillsSheet) ;
        this.redirectToSkillsSheet() ;
      }
    })

  }

  redirectToSkillsSheet() {
    this.router.navigate(['skills/skillsheet']);
  }

}
