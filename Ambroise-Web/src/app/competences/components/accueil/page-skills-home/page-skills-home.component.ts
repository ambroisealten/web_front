import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalSkillsCandidateComponent } from 'src/app/competences/components/accueil/modal-skills-candidate/modal-skills-candidate.component';
import { MatDialogConfig, MatDialog, MatTableDataSource, MatPaginator } from '@angular/material';
import { LoggerService, LogLevel } from 'src/app/services/logger.service';
import { Router } from '@angular/router';
import { SkillsSheetService } from 'src/app/competences/services/skillsSheet.service';
import { Person, PersonRole } from 'src/app/competences/models/person';
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



  skillsSheetDataSource: MatTableDataSource<SkillsSheet>;
  displayedColumns: string[] = ['Mail', 'Nom fiche', 'Moyenne Soft Skills'];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private dialog: MatDialog, 
    private router: Router, 
    private skillsSheetService: SkillsSheetService, 
    private personSkillsService: PersonSkillsService,
    private skillsService: SkillsService) { }

  ngOnInit() {
    this.skillsSheetService.getAllSkillSheets().subscribe(skillsSheetList => {
      if (skillsSheetList != undefined){
      this.skillsSheetDataSource = this.initDataSource(skillsSheetList); //new MatTableDataSource(skillsSheetList as SkillsSheet[]);

      // TEMP FOR PAGINATION TESTS
      for(let i = 0; i < 10; i++)
       {
        this.skillsSheetDataSource.data.push(skillsSheetList[0] as SkillsSheet);
      }



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
      }
    });

    setTimeout(() => this.skillsSheetDataSource.paginator = this.paginator);
  }

  initDataSource(skillsSheetsList) {
    let skillsSheets = skillsSheetsList as SkillsSheet[];
    let dataSource = new MatTableDataSource(skillsSheets);

    for(let elt of dataSource.data) {
      let sumSoftSkills = 0;
      for(let softSkill of elt.softSkillsList) {
        sumSoftSkills += this.literalToNumericGrade(softSkill.grade);
      }
      elt.averageSoftSkillsGrade = Math.round((sumSoftSkills / elt.softSkillsList.length) * 10) / 10;
    }

    return dataSource;
  }

  literalToNumericGrade(grade) {
    switch(grade) {
      case 'ONE': return 1;
      case 'ONEANDAHALF': return 1.5;
      case 'TWO': return 2;
      case 'THREE': return 3;
      case 'FOUR': return 4;
      default: return 0;
    }
  }

  /**
  * Filters array on input
  * @param  filterValue input string
  */
  applyFilterSkillsSheets(filterValue: string) {
    this.skillsSheetDataSource.filter = filterValue.trim().toLowerCase();
  }

  navigateToSkillsSheet(skillsSheetData) {
    this.personSkillsService.getPersonByMail(skillsSheetData.mailPersonAttachedTo, skillsSheetData.rolePersonAttachedTo).subscribe( person => {   
        this.skillsService.notifySkills(new Skills(person as Person,skillsSheetData))
        this.redirectToSkillsSheet();
      });
  }

  /**
  * Create a new skillsSheet
  */
  createSkillsSheetModal() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;

    const dialogRef = this.dialog.open(ModalSkillsCandidateComponent, dialogConfig);

    /*dialogRef.afterClosed().subscribe(newPerson => {
      if(newPerson != undefined)
      {
        this.personSkillsService.createNewPerson(newPerson).subscribe(httpResponse => {
          if(httpResponse != undefined) {
            this.skillsSheetService.getAllSkillSheets().subscribe(skillSheetsListData => this.checkNameUnicity(skillSheetsListData,newPerson));
          }
        });
      }
    });*/

    dialogRef.afterClosed().subscribe(response => {
      if(response != undefined) {
        this.redirectToSkillsSheet();
      }
    })
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
        this.skillsService.notifySkills(new Skills(person,currentSkillsSheet));
        this.redirectToSkillsSheet() ; 
      }
    })

  }

  redirectToSkillsSheet() {
    this.router.navigate(['skills/skillsheet']);
  }

}
