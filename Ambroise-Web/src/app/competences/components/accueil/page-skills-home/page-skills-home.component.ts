import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalSkillsCandidateComponent } from 'src/app/competences/components/accueil/modal-skills-candidate/modal-skills-candidate.component';
import { MatDialogConfig, MatDialog, MatTableDataSource, MatPaginator } from '@angular/material';
import { LoggerService, LogLevel } from 'src/app/services/logger.service';
import { Router } from '@angular/router';
import { SkillsSheetService } from 'src/app/competences/services/skillsSheet.service';
import { Person, PersonRole } from 'src/app/competences/models/person';
import { PersonSkillsService } from 'src/app/competences/services/personSkills.service';
import { SkillsSheet, Skill } from 'src/app/competences/models/skillsSheet';
import { SkillsService } from 'src/app/competences/services/skills.service';
import { Skills } from 'src/app/competences/models/skills';

@Component({
  selector: 'app-page-skills-home',
  templateUrl: './page-skills-home.component.html',
  styleUrls: ['./page-skills-home.component.scss']
})
export class PageSkillsHomeComponent implements OnInit {

  skillsSheetDataSource: MatTableDataSource<any[]> = new MatTableDataSource();
  //Tableau countenant les headers
  displayedColumns: string[] = ['Nom Prénom', 'Métier', 'Avis', 'Disponibilité', 'Moyenne Soft Skills', 'JEE', 'C++', '.NET', 'PHP', 'SQL'];
  //noCompColumns: string[] = ['Nom Prénom','Métier','Avis','Disponibilité'];
  //Tableau contenant les compétences
  compColumns: string[] = ['JEE', 'C++', '.NET', 'PHP', 'SQL'];

  //Tableau contenant les compétences recherchées
  compFilter: string[] = [] ; 
  //Tableau contenant les autres filtres
  filter: string[] = [] ; 



  rechercheInput: string;
  rechercheInputCpt: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private dialog: MatDialog,
    private router: Router,
    private skillsSheetService: SkillsSheetService,
    private personSkillsService: PersonSkillsService,
    private skillsService: SkillsService) { }

  ngOnInit() {
    this.skillsService.getAllSkills(this.filter,this.compFilter).subscribe(skillsList => {
      if (skillsList != undefined){
        console.log(skillsList)
        this.createDataSource(skillsList['results'] as Skills[])
        setTimeout(() => this.skillsSheetDataSource.paginator = this.paginator);
      }
    })
  }

  /**
   * Modeler les données reçu du serveur pour les faire correspondre au Mat Table
   * @param skillsList
   * @author Quentin Della-Pasqua
   */
  createDataSource(skillsList: Skills[]){
    let skillSheet: any[] = [];
    if(skillsList != []){
      skillsList.forEach(skills => {
        let tmpSkillSheet: any = {};
        if(skills['person'].hasOwnProperty('name') && skills['person'].hasOwnProperty('surname')){
          tmpSkillSheet['Nom Prénom'] = skills['person']['name'] + ' ' + skills['person']['surname'] ;
          tmpSkillSheet['Métier'] = this.instantiateProperty(skills['person'],'job') ; 
          tmpSkillSheet['Avis'] = this.instantiateProperty( skills['skillsSheet'],'avis') ; 
          tmpSkillSheet['Disponibilité'] = this.instantiateProperty(skills['person'],'disponibility') ;
          tmpSkillSheet['Moyenne Soft Skills'] = this.getAverageSoftSkillGrade(skills['skillsSheet']['skillsList']);
          this.compColumns.forEach(comp => {
            let tmpCompResult = skills.skillsSheet.skillsList.filter(skill => skill.name == comp) ; 
            if (tmpCompResult.length != 0){
              tmpSkillSheet[comp] = tmpCompResult[0] ; 
            } else {
              tmpSkillSheet[comp] = "" ; 
            }
          })
          tmpSkillSheet['skills'] = skills ; 
          skillSheet.push(tmpSkillSheet) ; 
        }
      })
      this.skillsSheetDataSource = new MatTableDataSource(skillSheet) ; 
    }
  }

  getAverageSoftSkillGrade(skillsList: Skill[]):number {
    let sumGrades = 0;
    let countSoft = 0; 
    for(let softSkill of skillsList) {
      if(softSkill.hasOwnProperty('isSoft')){
        sumGrades += softSkill.grade;
        countSoft += 1 ; 
      }
    }
    if(countSoft != 0){
      return sumGrades / countSoft ;
    }
    return 0 ;
  }

  instantiateProperty(property,testedProperty:string):any{
    if(property.hasOwnProperty(testedProperty)){
      return property[testedProperty] ;
    }
    return "";
  }

  /**
  * Filters array on input
  * @param  filterValue input string
  */
  applyFilterSkillsSheets(filterValue: string) {
    this.skillsSheetDataSource.filter = filterValue.trim().toLowerCase();
  }

  navigateToSkillsSheet(skillsSheetData) {
    this.personSkillsService.getPersonByMail(skillsSheetData.mailPersonAttachedTo).subscribe(person => {
      this.skillsService.notifySkills(new Skills(person as Person, skillsSheetData))
      this.redirectToSkillsSheet();
    });
  }

  /**
  * Ouvre une modal pour créer une nouvelle personne
  */
  createSkillsSheetModal() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;

    const dialogRef = this.dialog.open(ModalSkillsCandidateComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(skills => {
      let currentSkills = skills as Skills;
      if (skills != "canceled" && skills != undefined) {
        this.personSkillsService.createNewPerson(currentSkills.person).subscribe(httpResponse => {
          if (httpResponse != undefined) {
            this.createNewSkillSheet(currentSkills.person, currentSkills.skillsSheet);
          }
        });
      }
    });
  }

  /**
   * Crée le nom et fais la requête pour post la skillSheet
   * @param person
   * @author Quentin Della-Pasqua
   */
  createNewSkillSheet(person, skillsSheet) {
    this.skillsSheetService.createNewSkillsSheet(skillsSheet).subscribe(httpResponse => {
      if (httpResponse != undefined) {
        this.skillsService.notifySkills(new Skills(person, skillsSheet));
        this.redirectToSkillsSheet();
      }
    })

  }

  redirectToSkillsSheet(name:string, version:number) {
    this.router.navigate(['skills/skillsheet/'+name+'/'+version]);
  }

  /**
   * Ajoute une colonne au tableau + appel au WS pour trier
   * @author Quentin Della-Pasqua
   */
  doAddSkill() {
    if (this.compFilter.findIndex(filterTag => filterTag === this.rechercheInputCpt) == -1 &&  this.rechercheInputCpt != null && !this.rechercheInputCpt.match("^\ +") && this.rechercheInputCpt != "") {
      this.compFilter.push(this.rechercheInputCpt);
      this.displayedColumns.push(this.rechercheInputCpt);
    }
    this.rechercheInputCpt = "";
  }

  /**
   * Ajoute le filter a la liste 
   * @author Maxime Maquinghen
   */
  doAddFilter() {
    if (this.filter.findIndex(filterTag => filterTag === this.rechercheInput) == -1 &&  this.rechercheInput != null && !this.rechercheInput.match("^\ +")  && this.rechercheInput != "") {
      console.log("pas vide");
      this.filter.push(this.rechercheInput);
    }
    this.rechercheInput = "";
  }

  /**
   * 
   * @param event catch the delete event on tagWord of Competence
   * @author Maxime Maquinghen
   */
  deleteSkillWord(event) {
    this.compFilter = this.compFilter.filter(el => el !== event.srcElement.alt);
    this.displayedColumns = this.displayedColumns.filter(el => el !== event.srcElement.alt);
  }

  /**
   * 
   * @param event catch the delete event on tagWord of filter
   * @autho Maxime Maquinghen
   */
  deleteTagWord(event) {
    this.filter = this.filter.filter(el => el !== event.srcElement.alt);
  }

  /**
   * Get the value of the rating 
   * @param event catch the click event on star
   */
  minRatingValue(event) {
    LoggerService.log(event.srcElement.value, LogLevel.DEVDEBUG)
  }
}
