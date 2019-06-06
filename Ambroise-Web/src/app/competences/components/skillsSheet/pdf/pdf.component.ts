import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SkillGraduated, SkillsSheet, Skill } from 'src/app/competences/models/skillsSheet';
import { SubMenusService } from 'src/app/services/subMenus.service';
import { SkillsSheetService } from 'src/app/competences/services/skillsSheet.service';
import { Person } from 'src/app/competences/models/person';
import { Chart } from 'chart.js';
import { SkillsListService } from '../../../services/skillsList.service';


import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { SubMenu } from 'src/app/header/models/menu';

@Component({
  selector: 'app-pdf',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.scss']
})
export class PdfComponent implements OnInit, OnDestroy {

  //Data binding to Parent
  @Output() public goBack: EventEmitter<string> = new EventEmitter();

  //Charts
  skillsChart = Chart;
  softSkillsChart = Chart;

  //View's data
  skillsArray: SkillGraduated[] = [];
  softSkillsArray: SkillGraduated[] = [];
  currentPerson: Person;
  identityData: string = '';
  diplomaData: string = '';

  //PDF name
  pdfName : string;

  //route param
  name: string;
  version: number;

  //Subscriptions 
  submenusSubscription;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private subMenusService: SubMenusService,
    private skillsSheetService: SkillsSheetService,
    private skillsService: SkillsListService
  ) { }

  ngOnInit() {
    //
    this.subMenusService.resetMenuAction();

    //Url's param
    this.name = this.route.snapshot.paramMap.get('name');
    this.version = +this.route.snapshot.paramMap.get('version');

    //Person's Data
    this.currentPerson = JSON.parse(window.sessionStorage.getItem('person')) as Person;
    let job = this.currentPerson.job != "" ? this.currentPerson.job : "Fiche";
    this.pdfName = this.currentPerson.surname.toLowerCase()+this.currentPerson.name[0]+"-"+job;
    this.setIdentityData();
    this.setDiplomaData();

    //setup array
    this.setupArray();
    this.updateChartSkills(this.skillsArray);
    this.updateChartSoftSkills(this.softSkillsArray);

    if (this.skillsArray.length == 0) {
      this.skillsArray.push({ skill: { name: "Aucune compétence définie" }, grade: null } as SkillGraduated)
    }


    //Créer les menus
    this.createMenu();

    //Subscribe to action
    this.submenusSubscription = this.subMenusService.menuActionObservable.subscribe(action => this.doAction(action));
  }

  ngOnDestroy() {
    if (this.submenusSubscription !== undefined) {
      this.submenusSubscription.unsubscribe();
    }
  }

  /***********************************************************************\
  *
  *                          Main Function
  *
  \*************************************************************************/

  /**
   * Set Identity data to display Surname Name and Job
   * @author Quentin Della-Pasqua
   */
  setIdentityData() {
    this.identityData += this.currentPerson.surname + ' ' + this.currentPerson.name.substr(0, 1).toUpperCase() + '.';
    if (this.currentPerson.job !== '') {
      this.identityData += ', ' + this.currentPerson.job;
    }
  }

  /**
   * Set Diplomata data 
   * @author Quentin Della-Pasqua
   */
  setDiplomaData() {
    if (this.currentPerson.highestDiploma !== '') {
      this.diplomaData += this.currentPerson.highestDiploma + ' - ';
    }
    if (this.currentPerson.highestDiplomaYear !== '') {
      this.diplomaData += this.currentPerson.highestDiplomaYear;
    }
    if (this.diplomaData === '') {
      this.diplomaData = 'Donnée non renseignée';
    }
  }

  /**
   * setup data for pdf view
   * @author Quentin Della-Pasqua
   */
  setupArray() {
    let currentSkillsSheet: SkillsSheet;
    if (window.sessionStorage.getItem('skillsSheetVersions') === null || window.sessionStorage.getItem('skillsSheetVersions') === null) {
      this.router.navigate(['skills']);
    } else {
      const versions = JSON.parse(window.sessionStorage.getItem('skillsSheetVersions'));
      if (versions[0].name !== this.name || versions[0].versionNumber < this.version) {
        const skillsSheets = JSON.parse(window.sessionStorage.getItem('skills')) as SkillsSheet[];
        skillsSheets.forEach(skillsSheet => {
          if (skillsSheet.versionNumber === this.version && skillsSheet.name === this.name) {
            currentSkillsSheet = skillsSheet;
          }
        });
      } else {
        versions.forEach(skillsSheet => {
          if (skillsSheet.name === this.name && skillsSheet.versionNumber === this.version) {
            currentSkillsSheet = skillsSheet as SkillsSheet;
          }
        });
      }
    }
    currentSkillsSheet.skillsList.forEach(skill => {
      if (skill['skill'].hasOwnProperty('isSoft')) {
        this.softSkillsArray.push(skill);
      } else {
        this.skillsArray.push(skill);
      }
    });
    this.skillsArray.sort((e1, e2) => e1.grade < e2.grade ? 1 : -1);
    if (this.skillsArray.length > 24) {
      this.skillsArray = this.skillsArray.slice(0, 24);
    }
  }

  /**
  * Check s'il doit faire l'action, si oui, la réalise
  * @param action
  * @author Quentin Della-Pasqua
  */
  doAction(action: string) {
    if (action !== '') {
      const actionSplit = action.split('//');
      this.subMenusService.notifyMenuAction('');
      if (actionSplit[0] === this.router.url) {
        if (actionSplit[1] === 'create') {
          this.createSkillsSheet();
        } else if (actionSplit[1].match('^redirect/.*')) {
          const redirect = actionSplit[1].substring(9);
          if (('/' + redirect) !== this.router.url + '/') {
            this.router.navigate([redirect]);
            this.goBack.next(redirect);
          }
        }
      }
    }
  }

  /**
* Create the menu corresponding to the view
* @author Quentin Della-Pasqua
*/
  createMenu() {
    const skillsSheets = JSON.parse(window.sessionStorage.getItem('skills'));
    const subMenu: SubMenu[] = [];
    subMenu.push(this.subMenusService.createMenu('Accueil', [], 'home', 'redirect/skills', []));
    subMenu.push(this.subMenusService.createMenu('Nouvelle', [], 'note_add', 'create', []));
    let count = 0;
    const tmpSkillsSheet: SkillsSheet[] = [];
    skillsSheets.forEach(skillsSheet => {
      if (count < 3) {
        subMenu.push(this.subMenusService.createMenu(skillsSheet.name, [], 'description', 'redirect/skills/skillsheet/' + skillsSheet.name + '/' + skillsSheet.versionNumber + '/', []));
      } else {
        tmpSkillsSheet.push(skillsSheet);
      }
      count++;
    });
    if (count > 3) {
      subMenu.push(this.subMenusService.createMenu('Autres', tmpSkillsSheet, 'description', 'redirect/skills/skillsheet/', ['name', 'versionNumber']));
    }
    this.subMenusService.notifySubMenu(subMenu);
  }

  /***********************************************************************\
  *
  *                          SOUS-FONCTIONS
  *
 \*************************************************************************/

  createSkillsSheet() {
    const newSkillsSheet = new SkillsSheet('NEW-' + this.makeName(), this.currentPerson);
    const tmpSkillsSheets = JSON.parse(window.sessionStorage.getItem('skills')) as SkillsSheet[];
    while (tmpSkillsSheets.find(skillsSheet => skillsSheet.name === newSkillsSheet.name) !== undefined) {
      newSkillsSheet.name = 'NEW-' + this.makeName();
    }
    this.skillsSheetService.createNewSkillsSheet(newSkillsSheet).subscribe(httpResponse => {
      if (httpResponse['stackTrace'][0]['lineNumber'] === 201) {
        const tmpSkillsSheets = JSON.parse(window.sessionStorage.getItem('skills')) as SkillsSheet[];
        tmpSkillsSheets.push(newSkillsSheet);
        window.sessionStorage.setItem('skills', JSON.stringify(tmpSkillsSheets));
        this.redirectAfterAction('skills/skillsheet/' + newSkillsSheet.name + '/1');
      }
    });
  }

  makeName() {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 10; i++) { } {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  redirectAfterAction(redirect: string) {
    this.subMenusService.resetMenuAction();
    this.subMenusService.resetSubMenu();
    this.router.navigate([redirect]);
    this.goBack.next('skills/skillsheet/');
  }

  goBackToSkillsForm() {
    this.goBack.next('goBack');
  }

  downloadPDF() {
    var data = document.getElementById("contentToConvert");
    html2canvas(data, { scale: 2.5, allowTaint: true, useCORS: true }).then(canvas => {
      const contentDataURL = canvas.toDataURL('image/jpeg')

      const pdf = new jspdf('landscape', undefined, 'a4'); // A4 size page of PDF  
      var width = pdf.internal.pageSize.getWidth();
      var height = pdf.internal.pageSize.getHeight();

      pdf.addImage(contentDataURL, 'JPEG', 0, 0, 297, 210);
      pdf.save(this.pdfName + '.pdf'); // Generated PDF   
    });
  }

  countSkill() {
    if (this.skillsArray.length <= 12) {
      return true;
    }
    else if (this.skillsArray.length > 12) {
      return false;
    }
  }

  /***********************************************************************\
  *
  *                          CHART FUNCTIONS
  *
 \***********************************************************************/

  /**
   * Updates the radar chart for skills
   * @param  arraySkills Array containing updated skills
   */
  updateChartSkills(arraySkills: SkillGraduated[]) {

    if (typeof this.skillsChart !== 'function') {
      this.skillsChart.destroy();
    }
    if (arraySkills.length !== 0) {
      const skillsLabels: string[] = [];
      const skillsData: number[] = [];
      arraySkills.forEach((skillGraduated) => {
        skillsLabels.push(skillGraduated.skill.name);
        skillsData.push(skillGraduated.grade);
      });
      this.skillsChart = this.createOrUpdateChart(this.formatLabels(skillsLabels, 8), skillsData, 'canvasSkills');
    }
  }

  /**
   * Updates the radar chart for soft skills
   * @param  arraySkills Array containing updated soft skills
   */
  updateChartSoftSkills(arraySoftSkills: SkillGraduated[]) {
    if (typeof this.softSkillsChart !== 'function') {
      this.softSkillsChart.destroy();
    }
    if (arraySoftSkills.length !== 0) {
      const skillsLabels: string[] = [];
      const skillsData: number[] = [];
      arraySoftSkills.forEach((skillGraduated) => {
        skillsLabels.push(skillGraduated.skill.name);
        skillsData.push(skillGraduated.grade);
      });
      this.softSkillsChart = this.createOrUpdateChart(this.formatLabels(skillsLabels, 8), skillsData, 'canvasSoftSkills');
    }
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
            min: 0,
            max: 4,
            step: 0.5
          },
          pointLabels: {
            fontSize: 16
          }
        },
        tooltips: {
          callbacks: {
            label: (tooltipItem, data) => {
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
  formatLabels(labels, maxwidth) {
    const formattedLabels = [];

    labels.forEach((label) => {
      const sections = [];
      const words = label.split(' ');
      let temp = '';

      words.forEach((item, index) => {
        if (temp.length > 0) {
          const concat = temp + ' ' + item;

          if (concat.length > maxwidth) {
            sections.push(temp);
            temp = '';
          }
          else {
            if (index === (words.length - 1)) {
              sections.push(concat);
              return;
            }
            else {
              temp = concat;
              return;
            }
          }
        }

        if (index === (words.length - 1)) {
          sections.push(item);
          return;
        }

        if (item.length < maxwidth) {
          temp = item;
        }
        else {
          sections.push(item);
        }

      });
      formattedLabels.push(sections);
    });
    return formattedLabels;
  }


}
