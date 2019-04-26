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

  skillsSheetDataSource: MatTableDataSource<any[]>;
  //Tableau countenant les headers
  displayedColumns: string[]  = ['Nom Prénom','Métier','Avis','Disponibilité','Moyenne Soft Skills','JEE','C++','.NET','PHP','SQL'];
  //noCompColumns: string[] = ['Nom Prénom','Métier','Avis','Disponibilité'];
  //Tableau contenant les compétences
  compColumns: string[] = ['JEE','C++','.NET','PHP','SQL'] ;

  //Tableau contenant les compétences recherchées
  compFilter: string[] = [];
  //Tableau contenant les autres filtres
  filter: string[] = [];



  rechercheInput:string;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private dialog: MatDialog,
    private router: Router,
    private skillsSheetService: SkillsSheetService,
    private personSkillsService: PersonSkillsService,
    private skillsService: SkillsService) { }


  /**
   * TO CHANGE
   */
  ngOnInit() {
    this.skillsSheetService.getAllSkillSheets().subscribe(skillsSheetList => {
      console.log(skillsSheetList)
      if (skillsSheetList != undefined){
        this.createDataSource(skillsSheetList)
        setTimeout(() => this.skillsSheetDataSource.paginator = this.paginator);
      }
    });

  }

  /**
   * Modeler les données reçu du serveur pour les faire correspondre au Mat Table
   * @param skillsList
   * @author Quentin Della-Pasqua
   */
  createDataSource(skillsList){
    let skillSheet: any[];
    skillsList.forEach(skills => {
      let tmpSkillSheet: any;
      if(skills['person'].hasOwnProperty('name') && skills['person'].hasOwnProperty('surname')){
        tmpSkillSheet['Nom Prénom'] = skills['person']['name'] + ' ' + skills['person']['surname'] ;
        tmpSkillSheet['Métier'] = this.instantiateProperty(skills['person'],'job') ;
        tmpSkillSheet['Avis'] = this.instantiateProperty( skills['skillsSheet'],'avis') ;
        tmpSkillSheet['Disponibilité'] = this.instantiateProperty(skills['person'],'disponibility') ;
        tmpSkillSheet['Moyenne Soft Skills'] = skills['skillsSheet'].getAverageSoftSkillgrade() ;
        this.compColumns.forEach(comp => {
          let tmpCompResult = skills.skillsList.filter(skill => skill.name == comp) ;
          if (tmpCompResult != []){
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

  instantiateProperty(property,testedProperty:String):any{
    if(property.hasOwnProperty(testedProperty)){
      return property['testProperty'] ;
    }
    return "" ;
  }

  /**
  * Filters array on input
  * @param  filterValue input string
  */
  applyFilterSkillsSheets(filterValue: string) {
    this.skillsSheetDataSource.filter = filterValue.trim().toLowerCase();
  }

  navigateToSkillsSheet(skillsSheetData) {
    this.personSkillsService.getPersonByMail(skillsSheetData.mailPersonAttachedTo).subscribe( person => {   
        this.skillsService.notifySkills(new Skills(person as Person,skillsSheetData))
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

    dialogRef.afterClosed().subscribe(newPerson => {
      if(newPerson != "canceled" && newPerson != undefined)
      {
        this.personSkillsService.createNewPerson(newPerson).subscribe(httpResponse => {
          if(httpResponse != undefined) {
            this.createNewSkillSheet(newPerson);
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
  createNewSkillSheet(person){
    let date = String("0" + (new Date().getMonth()+1)).slice(-2) + new Date().getFullYear();
    let trigramme = person.name.substring(0,1) + person.surname.substring(0,2);
    let tmpSkillsSheetName =  date + '-' + trigramme;
    tmpSkillsSheetName = tmpSkillsSheetName.toUpperCase() ;
    let tmpSkillSheet = new SkillsSheet(tmpSkillsSheetName,person)
    this.skillsSheetService.createNewSkillsSheet(tmpSkillSheet).subscribe(httpResponse => {
      if(httpResponse != undefined) {
        this.skillsService.notifySkills(new Skills(person,tmpSkillSheet));
        this.redirectToSkillsSheet() ;
      }
    })

  }

  redirectToSkillsSheet() {
    this.router.navigate(['skills/skillsheet']);
  }

  /**
   * Ajoute une colonne au tableau + appel au WS pour trier
   * @author Quentin Della-Pasqua
   */
  doAddSkill(){
    this.displayedColumns.push(this.rechercheInput) ;
    this.compFilter.push(this.rechercheInput);
    this.rechercheInput = "";
  }

  doAddFilter(){
    if ( this.filter.findIndex(filterTag => filterTag === this.rechercheInput ) == -1)
    this.filter.push(this.rechercheInput);
    this.rechercheInput = "";
  }

  deleteSkillWord(event) {
    this.compFilter = this.compFilter.filter(el => el !== event.srcElement.alt); 
  }
  deleteTagWord(event) {
    this.filter = this.filter.filter(el => el !== event.srcElement.alt); 
  }

  minRatingValue(event){
    LoggerService.log(event.srcElement.value,LogLevel.DEVDEBUG)
  }
}
