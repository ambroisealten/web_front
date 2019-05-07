import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalSkillsCandidateComponent } from 'src/app/competences/components/accueil/modal-skills-candidate/modal-skills-candidate.component';
import { MatDialogConfig, MatDialog, MatTableDataSource, MatPaginator, MatExpansionPanel } from '@angular/material';
import { LoggerService, LogLevel } from 'src/app/services/logger.service';
import { Router } from '@angular/router';
import { SkillsSheetService } from 'src/app/competences/services/skillsSheet.service';
import { PersonSkillsService } from 'src/app/competences/services/personSkills.service';
import { SkillsSheet, SkillGraduated, SkillsSheetVersions } from 'src/app/competences/models/skillsSheet';
import { SkillsService } from 'src/app/competences/services/skills.service';
import { Skills } from 'src/app/competences/models/skills';
import { Person } from 'src/app/competences/models/person';
import { SubMenu } from 'src/app/header/models/menu';
import { SubMenusService } from 'src/app/services/subMenus.service';

@Component({
  selector: 'app-page-skills-home',
  templateUrl: './page-skills-home.component.html',
  styleUrls: ['./page-skills-home.component.scss']
})
export class PageSkillsHomeComponent implements OnInit {

  @ViewChild('expansionCPT') expansionCPT: MatExpansionPanel ;

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

  //current skills[]
  currentSkills: Skills[] ;

  //Subscription
  subMenusSubscription ;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private dialog: MatDialog,
    private router: Router,
    private skillsSheetService: SkillsSheetService,
    private personSkillsService: PersonSkillsService,
    private skillsService: SkillsService,
    private subMenusService: SubMenusService) { }

  ngOnInit() {
    this.searchSkillSheets();
    this.createMenu(); 
    this.subMenusSubscription = this.subMenusService.menuActionObservable.subscribe(action => this.doAction(action)) ;
  }

  ngOnDestroy(){
    if(this.subMenusSubscription != undefined){
      this.subMenusSubscription.unsubscribe() ; 
    } else {
      LoggerService.log("ERROR SUBSCRIPTION : subMenusSubscription (page-skills-home Component), should have been set up",LogLevel.DEV)
    }
  }
  /**
   * Cherche toutes les skillSheets
   * @author Quentin Della-pasqua
   */
  searchSkillSheets() {
    this.skillsService.getAllSkills(this.filter,this.compFilter).subscribe(skillsList => {
      if (skillsList != undefined){
        this.createDataSource(skillsList['results'] as Skills[])
        setTimeout(() => this.skillsSheetDataSource.paginator = this.paginator);
      }
    })
  }

  /**
   * Crée les menus associé à la vue
   * @author Quentin Della-Pasqua
   */
  createMenu(){
    let subMenu: SubMenu[] = [] ; 
    subMenu.push(this.subMenusService.createMenu('Nouvelle', [], 'add_circle', 'create', []))
    this.subMenusService.notifySubMenu(subMenu);
  }

  /**
   * Regarde quel action est envoyer par le header, la vérifie et la traite si c'est pour lui
   * @param action 
   * @author Quentin Della-Pasqua
   */
  doAction(action: string) {
    if (action != "") {
      let actionSplit = action.split('//');
      this.subMenusService.notifyMenuAction("");
      if (actionSplit[0] == this.router.url) {
        if (actionSplit[1] === 'create') {
          this.createSkillsSheetModal() ;
        } 
      }
    }
  }

  /***********************************************************************\
   *        
   *                          SOUS-FONCTIONS          
   *                                                                      
  \***********************************************************************/


  /**
   * Modeler les données reçu du serveur pour les faire correspondre au Mat Table
   * @param skillsList
   * @author Quentin Della-Pasqua
   */
  createDataSource(skillsList: Skills[]){
    let skillSheet: any[] = [];
    if(skillsList != []){
      this.currentSkills = skillsList ;
      skillsList.forEach(skills => {
        let tmpSkillSheet: any = {};
        if(skills['person'].hasOwnProperty('name') && skills['person'].hasOwnProperty('surname')){
          tmpSkillSheet['nameSkillsSheet'] = skills['skillsSheet']['name'] ;
          tmpSkillSheet['Nom Prénom'] = skills['person']['name'] + ' ' + skills['person']['surname'] ;
          tmpSkillSheet['Métier'] = this.instantiateProperty(skills['person'],'job') ;
          tmpSkillSheet['Avis'] = this.instantiateProperty( skills['skillsSheet'],'avis') ;
          tmpSkillSheet['Disponibilité'] = this.instantiateProperty(skills['person'],'disponibility') ;
          tmpSkillSheet['Moyenne Soft Skills'] = this.getAverageSoftSkillGrade(skills['skillsSheet']['skillsList']);
          this.compColumns.forEach(comp => {
            let tmpCompResult = skills['skillsSheet']['skillsList'].find(skill => skill['skill']['name'].toLowerCase() == comp.toLowerCase())
            if (tmpCompResult != undefined){
              tmpSkillSheet[comp] = tmpCompResult.grade;
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

  /**
   * Factorise les conditions if 
   * @param property 
   * @param testedProperty 
   * @author Quentin Della-Pasqua
   */
  instantiateProperty(property,testedProperty:string):any{
    if(property.hasOwnProperty(testedProperty)){
      return property[testedProperty] ;
    }
    return "";
  }

  /**
   * Calcul de la moyenne des soft skills
   * @param skillsList
   * @author Quentin Della-Pasqua, Camille Schnell
   */
  getAverageSoftSkillGrade(skillsList: SkillGraduated[]):number {
    let sumGrades = 0;
    let countSoft = 0;
    for(let softSkill of skillsList) {
      if(softSkill['skill'].hasOwnProperty('isSoft')){
        sumGrades += softSkill.grade;
        countSoft += 1 ;
      }
    }
    if(countSoft != 0){
      return +(sumGrades / countSoft).toFixed(2);
    }
    return 0 ;
  }

  /**
  * Filters array on input
  * @param  filterValue input string
  */
  applyFilterSkillsSheets(filterValue: string) {
    this.skillsSheetDataSource.filter = filterValue.trim().toLowerCase();
  }

  navigateToSkillsSheet(skillsSheetData) {
      let skills = this.currentSkills.find(skills => skills['skillsSheet']['name'] == skillsSheetData['nameSkillsSheet'] );
      this.skillsService.notifySkills(skills);
      this.redirectToSkillsSheet(skills['skillsSheet']['name'],skills['skillsSheet']['versionNumber']);
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
        if(currentSkills.skillsSheet.versionDate != "") { // if existant skillsSheet
          this.personSkillsService.getPersonByMail(currentSkills.skillsSheet.mailPersonAttachedTo).subscribe( person => {
            this.skillsService.notifySkills(new Skills(person as Person,currentSkills.skillsSheet))
          });
          this.redirectToSkillsSheet(currentSkills.skillsSheet.name, currentSkills.skillsSheet.versionNumber);
        }
        else {
          this.personSkillsService.createNewPerson(currentSkills.person).subscribe(httpResponse => {
            if(httpResponse != undefined) {
              this.createNewSkillSheet(currentSkills.person, currentSkills.skillsSheet);
            }
          });
        }
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
      if(httpResponse != undefined) {
        this.skillsService.notifySkills(new Skills(person,skillsSheet));
        this.redirectToSkillsSheet(skillsSheet.name, skillsSheet.versionNumber);
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
    if (this.compFilter.findIndex(filterTag => filterTag.toLowerCase() === this.rechercheInputCpt.toLowerCase()) == -1 &&  this.rechercheInputCpt != null && !this.rechercheInputCpt.match("^\ +") && this.rechercheInputCpt != "") {
      this.compFilter.push(this.rechercheInputCpt);
      this.compColumns.push(this.rechercheInputCpt);
      this.displayedColumns.push(this.rechercheInputCpt);
      this.searchSkillSheets();
      this.expansionCPT.expanded = true ;
    }
    this.rechercheInputCpt = "";
  }

  /**
   * Ajoute le filter a la liste
   * @author Maxime Maquinghen
   */
  doAddFilter() {
    if (this.filter.findIndex(filterTag => filterTag.toLowerCase() === this.rechercheInput.toLowerCase()) == -1 &&  this.rechercheInput != null && !this.rechercheInput.match("^\ +")  && this.rechercheInput != "") {
      this.filter.push(this.rechercheInput);
      this.searchSkillSheets();
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
    this.searchSkillSheets();
  }

  /**
   *
   * @param event catch the delete event on tagWord of filter
   * @autho Maxime Maquinghen
   */
  deleteTagWord(event) {
    this.filter = this.filter.filter(el => el !== event.srcElement.alt);
    this.searchSkillSheets();
  }

  /**
   * Get the value of the rating
   * @param event catch the click event on star
   */
  minRatingValue(event) {
    LoggerService.log(event.srcElement.value, LogLevel.DEVDEBUG)
  }

}
