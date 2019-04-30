import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { LogLevel, LoggerService } from 'src/app/services/logger.service';
import { MatDialog } from '@angular/material';
import { SkillsSheetService } from 'src/app/competences/services/skillsSheet.service';
import { ConfirmationDialogComponent } from 'src/app/utils/confirmation-dialog/confirmation-dialog.component';
import { Person, PersonRole } from 'src/app/competences/models/person';
import { SkillsSheet, Skill } from 'src/app/competences/models/skillsSheet';
import { SkillsService } from 'src/app/competences/services/skills.service';
import { ArrayObsService } from 'src/app/competences/services/arrayObs.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTabLinkBase } from '@angular/material/tabs/typings/tab-nav-bar';
import { Skills } from 'src/app/competences/models/skills';
import { SubMenusService } from 'src/app/services/subMenus.service';
import { Menu, SubMenu } from 'src/app/header/models/menu';

@Component({
  selector: 'app-skills-form',
  templateUrl: './skills-form.component.html',
  styleUrls: ['./skills-form.component.scss']
})
/**
* Component containing the skillsSheet creation form.
* @param skillsSheetService service handling back-end communication and data
*/
export class SkillsFormComponent implements OnInit {

  lastModificationsArray: any[];
  lastModifDisplayedColumns: string[] = ['manager', 'date', 'action'];

  //Information of tech skills
  skillsArray: any[] = [];
  skillsDisplayedColumns: string[] = ['skillName', 'grade'];

  //Information of soft skills
  softSkillsArray: any[] = [];
  softSkillsDisplayedColumns: string[] = ['skillName', 'grade'];

  headerRowHiddenModif = false;
  headerRowHiddenSkills = true;

  //Form displayed
  formItems: any[];

  //Charts
  skillsChart = Chart;
  softSkillsChart = Chart;

  showPassToConsultant: boolean = true;

  //current Info 
  currentPerson: Person;
  currentSkillsSheet: SkillsSheet;

  //information contains in the path
  name: string;
  version: number ; 

  //
  avis: string;

  constructor(private skillsService: SkillsService,
              private dialog: MatDialog,
              private skillsSheetService: SkillsSheetService,
              private arrayObsService: ArrayObsService,
              private router: Router,
              private route: ActivatedRoute,
              private subMenusService: SubMenusService) { }


  ngOnInit() {
    //Get param in the url 
    this.name = this.route.snapshot.paramMap.get("name") ;
    this.version = +this.route.snapshot.paramMap.get("version") ;
    //Check if data already exists, person is more important than skillsSheet 
    if (window.sessionStorage.getItem('person') != null){
      this.currentPerson = JSON.parse(window.sessionStorage.getItem('person')) as Person  ; 
      if(window.sessionStorage.getItem('skills') != null){
        this.setupSkillsSheet(JSON.parse(window.sessionStorage.getItem('skills')) as SkillsSheet[],true)
        this.initializeView(new Skills(this.currentPerson,this.currentSkillsSheet),true) ; 
        this.createMenu() ;
      } else {
        this.skillsSheetService.getAllSkillSheets(this.currentPerson.mail).subscribe(skillsSheets  => {
          this.setupSkillsSheet(skillsSheets as SkillsSheet[],false) ;
          this.initializeView(new Skills(this.currentPerson,this.currentSkillsSheet),true);
          this.createMenu() ;
        })
      }
    } else {
      this.skillsService.skillsObservable.subscribe(skills => this.initializeView(skills,false))
    }
    //if we are consultant or applicant we don't have the same information so we load the form that match with the role
    let formItemsJSON = require('../../../resources/formItems.json');
    if(this.currentPerson.role == PersonRole.APPLICANT){
      this.formItems = formItemsJSON["candidateFormItems"];
    } else if (this.currentPerson.role.toUpperCase() == PersonRole.CONSULTANT ){
      this.formItems = formItemsJSON["consultantFormItems"]
    } else {
      this.formItems = null ;
    }
    //Update chart 
    this.arrayObsService.arraySkillsObservable.subscribe(arraySkills => this.updateChartSkills(arraySkills));
    this.arrayObsService.arraySoftSkillsObservable.subscribe(arraySoftSkills => this.updateChartSoftSkills(arraySoftSkills)) ; 
  }

  /**
   * Create the menu corresponding to the view
   * @author Quentin Della-Pasqua
   */
  createMenu(){
    let skillsSheet = JSON.parse(window.sessionStorage.getItem('skills'))
    let subMenu: SubMenu[] ; 
    subMenu.push(this.subMenusService.createMenu('Accueil',[],'home','redirect/skills'))
    this.subMenusService.notifySubMenu(new Menu("Compétences",subMenu))
  }

  /**
   * Check among skillsSheet the one which correspond to the url 
   * @param skillsSheets 
   * @author Quentin Della-Pasqua
   */
  setupSkillsSheet(skillsSheets: SkillsSheet[], skillsSheetStored){
    skillsSheets.forEach(skillsSheet => {
      if(skillsSheet.versionNumber == this.version && skillsSheet.name == this.name){
        this.currentSkillsSheet = skillsSheet ; 
      }
    })
    if(!skillsSheetStored){
      window.sessionStorage.setItem('skills',JSON.stringify(skillsSheets)); 
    }
  }

  /**
   * Initialize components (creating soft and tech skills array, set up var, etc..)
   * @param skills
   * @author Quentin Della-Pasqua 
   */
  initializeView(skills,personStored:boolean){
    if(skills == undefined){
      this.router.navigate(['skills']);
    } else {
      this.currentPerson = skills.person ; 
      this.currentSkillsSheet = skills.skillsSheet ; 
      this.lastModificationsArray = this.skillsSheetService.lastModificationsArray;
      skills.skillsSheet.skillsList.forEach(skill => {
        if(skill.hasOwnProperty('isSoft')){
          this.softSkillsArray.push(skill); 
        } else {
          this.skillsArray.push(skill)
        }
      });
    this.arrayObsService.notifySkills(this.softSkillsArray) ; 
    this.arrayObsService.notifySoftSkills(this.skillsArray)
    }
    if(!personStored){
      window.sessionStorage.setItem('person',JSON.stringify(this.currentPerson));
      this.skillsSheetService.getAllSkillSheets(this.currentPerson.mail).subscribe(skillsSheets  =>  {
        window.sessionStorage.setItem('skills',JSON.stringify(skillsSheets))
        this.createMenu(); 
      });
    }
  }

  translate(roleName) {
    return roleName.toLowerCase() === 'applicant' ? 'Candidat' : 'Consultant';
  }

  /**
  * Calls skills service to save current skillsSheet
  */
  onSubmitForm() {
    LoggerService.log("submit", LogLevel.DEBUG);
    LoggerService.log(this.currentSkillsSheet, LogLevel.DEBUG);
    this.skillsSheetService.updateSkillsSheet(this.currentSkillsSheet).subscribe(httpResponse => this.currentSkillsSheet.versionNumber += 1) ;
  }

  updateChartSkills(arraySkills: Skill[]){
    console.log(typeof this.skillsChart)
    if (typeof this.skillsChart != "function"){
      this.skillsChart.destroy() ; 
    }
    let skillsLabels: string[] = [];
    let skillsData: number[] = [];
    arraySkills.forEach(function(skill) {
      skillsLabels.push(skill.name);
      skillsData.push(skill.grade);
    });
    this.skillsChart = this.createOrUpdateChart(this.formatLabels(skillsLabels,8), skillsData, 'canvasSkills');
    this.skillsArray = arraySkills ; 
    this.currentSkillsSheet.skillsList = this.skillsArray.concat(this.softSkillsArray) ; 
  }

  updateChartSoftSkills(arraySoftSkills: Skill[]){
    if(typeof this.softSkillsChart != "function"){
      this.softSkillsChart.destroy() ; 
    }
    let skillsLabels: string[] = [];
    let skillsData: number[] = [];
    arraySoftSkills.forEach(function(skill) {
      skillsLabels.push(skill.name);
      skillsData.push(skill.grade);
    });
    this.softSkillsChart = this.createOrUpdateChart(this.formatLabels(skillsLabels,8), skillsData, 'canvasSoftSkills');
    this.softSkillsArray = arraySoftSkills ; 
    this.currentSkillsSheet.skillsList = this.skillsArray.concat(this.softSkillsArray) ; 
  }

  /**
  * Create a radar chart (skills matrix)
  * @param  labels    labels to display on the chart
  * @param  data      data for the chart
  * @param  elementId 'canvasSkills' or 'canvasSoftSkills'
  * @return           a radar chart
  */
  createOrUpdateChart(labels, data, elementId) {
    return new Chart(elementId, {
      type: 'radar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Note',
          data: data,
          backgroundColor: [
            'rgba(00, 139, 210, 0.2)',
            'rgba(54, 162, 235, 0.2)'
          ],
          borderColor: [
            'rgba(00, 139, 210, 1)',
            'rgba(54, 162, 235, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scale: {
          ticks: {
            min: 1,
            max: 4,
            step: 0.5
          }
        },
        tooltips: {
          callbacks: {
            label: function(tooltipItem, data) {
              var label = data.labels[tooltipItem.index];
              return data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
            }
          }
        },
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  /* takes a string phrase and breaks it into separate phrases
  no bigger than 'maxwidth', breaks are made at complete words.*/
  /**
  * Breaks labels into arrays to display them in multiple lines in radar chart.
  * Breaks are made at complete words.
  * @param  labels   array of labels
  * @param  maxwidth max width per line
  * @return          new array with formatted labels
  */
  formatLabels(labels, maxwidth){
    let formattedLabels = [];

    labels.forEach(function(label) {
      let sections = [];
      let words = label.split(" ");
      let temp = "";

      words.forEach(function(item, index){
        if(temp.length > 0)
        {
          let concat = temp + ' ' + item;

          if(concat.length > maxwidth){
            sections.push(temp);
            temp = "";
          }
          else{
            if(index == (words.length-1))
            {
              sections.push(concat);
              return;
            }
            else{
              temp = concat;
              return;
            }
          }
        }

        if(index == (words.length-1))
        {
          sections.push(item);
          return;
        }

        if(item.length < maxwidth) {
          temp = item;
        }
        else {
          sections.push(item);
        }

      });
      formattedLabels.push(sections);
    })
    return formattedLabels;
  }


}
