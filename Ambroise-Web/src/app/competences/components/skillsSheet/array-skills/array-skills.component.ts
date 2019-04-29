import { Component, OnInit, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { SkillsSheetService } from '../../../services/skillsSheet.service';
import { ArrayObsService } from 'src/app/competences/services/arrayObs.service';
import { Skill } from 'src/app/competences/models/skillsSheet';

@Component({
  selector: 'app-array-skills',
  templateUrl: './array-skills.component.html',
  styleUrls: ['./array-skills.component.scss']
})
/**
* Component containing an array with skills or soft skills and their grades
*/
export class ArraySkillsComponent implements OnInit {

  @Input() displayedColumns: string[]; // names of columns to display
  @Input() dataSourceArray: any[]; // data array
  @Input() headerRowHidden: boolean; // is header row (columns title) hidden
  @Input() datatype: string; // 'skills' or 'softSkills'

  dataSource: MatTableDataSource<Skill[]>; // data as MatTableDataSource

  constructor(private arrayObsService: ArrayObsService) { }

  /**
   * Inits dataSource of array : skills or soft skills
   */
  ngOnInit() {
    if(this.datatype == "skills"){
      this.arrayObsService.arraySkillsObservable.subscribe(arraySkills => {
        this.dataSource = new MatTableDataSource(arraySkills) ;
      });
    } else {
      this.arrayObsService.arraySoftSkillsObservable.subscribe(arraySoftSkills =>  {
        this.dataSource = new MatTableDataSource(arraySoftSkills) ;
      });
    }
  }

  setDataSource(arraySkills: Skill[][]){
    this.dataSource = new MatTableDataSource(arraySkills) ;
  }

  /**
   * Checks input of grade and sets to 1 if empty or invalid
   * @param  $event input grade
   */
  setToOneIfEmptyOrInvalid($event) {
    let grade: string = $event.target.value;
    let pattern: string = "^([1-3]([\\.|,]5)?)$|^4$"; // number between 1 and 4 (step 0,5) or 0
    if(!grade.match(pattern) || $event.target.value == '') {
      $event.target.value = 1;
    }
  }

  /**
  * Filters array on input
  * @param  filterValue input string
  */
  applyFilterSkills(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /**
  * Adds a skill into the array
  * @param  event skillName from input
  */
  addSkill(event) {
    if(event.target.value != '') {
      let skillName = event.target.value;

      // if skillname not already in array : add it
      if(this.dataSourceArray.findIndex(skill => skill.name.toLowerCase().trim() === skillName.toLowerCase().trim()) == -1) {
        this.dataSourceArray.push({name: skillName, grade: 1});
        this.dataSource = new MatTableDataSource(this.dataSourceArray);

        this.updateDataSourceInService();
      }
    }
  }

  /**
  * Removes a skill from the array
  * @param  event button clicked in skill row
  */
  removeSkill(event) {
    let skillName = event.target.closest('tr').childNodes[1].innerText; // get skillName from row
    let skillIndex = this.dataSourceArray.findIndex(skill => skill.name === skillName);

    this.dataSourceArray.splice(skillIndex, 1);
    this.dataSource = new MatTableDataSource(this.dataSourceArray);

    this.updateDataSourceInService();

  }

  /**
  * Handles the stepUp() and stepDown() functions for the grades in the array.
  * @param  event grade value from input
  */
  updateGradeEvent(event) {
    let skillName = event.target.closest('tr').childNodes[1].innerText; // get skillName from same row as modified grade
    let grade = event.target.parentElement.childNodes[1].value;

    this.dataSourceArray.forEach(function(skill) {
      if(skill.name == skillName){
        if(grade == 1.5 && event.target.className == "incrementButton" ){
          skill.grade = 2
        } else if (grade == 1.5 && event.target.className == "decrementButton") {
          skill.grade = 1
        } else {
          skill.grade = grade;
        }
      }
    });

    this.updateDataSourceInService();

  }

  /**
  * Updates skills or softSkills array in skills service
  */
  updateDataSourceInService() {
    if(this.datatype == "skills"){
      this.arrayObsService.notifySkills(this.dataSourceArray);
    } else {
      this.arrayObsService.notifySoftSkills(this.dataSourceArray);
    }
  }
}
