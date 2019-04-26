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

  skills: Skills[] = []; 

  skillsSheetDataSource: MatTableDataSource<any[]>;
  //Tableau countenant les headers
  displayedColumns: string[]  = ['Nom Prénom','Métier','Avis','Disponibilité','Moyenne Soft Skills','JEE','C++','.NET','PHP','SQL'];
  //noCompColumns: string[] = ['Nom Prénom','Métier','Avis','Disponibilité'];
  //Tableau contenant les compétences
  compColumns: string[] = ['JEE','C++','.NET','PHP','SQL'] ;

  //Tableau contenant les compétences recherchées
  compFilter: string[] ;
  //Tableau contenant les autres filtres
  filter: string[] ;

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
    /*
    this.skillsSheetService.getAllSkillSheets().subscribe(skillsSheetList => {
      console.log(skillsSheetList)
      if (skillsSheetList != undefined){
        this.createDataSource(skillsSheetList)
        setTimeout(() => this.skillsSheetDataSource.paginator = this.paginator);
      }
    });
    */
   let person = new Person("Surname","Name","Mail",PersonRole.APPLICANT)
   let skillSheet = new SkillsSheet("nameSkillsSheet",person)
   for(let i = 0 ; i < 15 ; i++){
    this.skills.push(new Skills(person,skillSheet))
   }
   this.createDataSource(this.skills)
  }

  /**
   * Modeler les données reçu du serveur pour les faire correspondre au Mat Table
   * @param skillsList
   * @author Quentin Della-Pasqua
   */
  createDataSource(skillsList){
    let skillSheet: any[]= [];
    skillsList.forEach(skills => {
      let tmpSkillSheet: any = {} ;
      if(skills['person'].hasOwnProperty('name') && skills['person'].hasOwnProperty('surname')){
        tmpSkillSheet['Nom Prénom'] = skills['person']['name'] + ' ' + skills['person']['surname'] ;
        tmpSkillSheet['Métier'] = this.instantiateProperty(skills['person'],'job') ;
        tmpSkillSheet['Avis'] = this.instantiateProperty( skills['skillsSheet'],'avis') ;
        tmpSkillSheet['Disponibilité'] = this.instantiateProperty(skills['person'],'disponibility') ;
        tmpSkillSheet['Moyenne Soft Skills'] = skills['skillsSheet'].getAverageSoftSkillGrade() ;
        this.compColumns.forEach(comp => {
          let tmpCompResult = skills.skillsSheet.skillsList.filter(skill => skill.name == comp) ;
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

    setTimeout(() => this.skillsSheetDataSource.paginator = this.paginator);
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

    dialogRef.afterClosed().subscribe(skills => {
      let currentSkills = skills as Skills;
      if(skills != "canceled" && skills != undefined)
      {
        this.personSkillsService.createNewPerson(currentSkills.person).subscribe(httpResponse => {
          if(httpResponse != undefined) {
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
  createNewSkillSheet(person, skillsSheet){
    this.skillsSheetService.createNewSkillsSheet(skillsSheet).subscribe(httpResponse => {
      if(httpResponse != undefined) {
        this.skillsService.notifySkills(new Skills(person,skillsSheet));
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
    this.compColumns.push(this.rechercheInput) ;
    this.compFilter.push(this.rechercheInput) ;
  }

}
