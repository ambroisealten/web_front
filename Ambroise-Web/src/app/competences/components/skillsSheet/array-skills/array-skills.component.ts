import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Skill, SkillGraduated } from 'src/app/competences/models/skillsSheet';

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
  @Input() dataSource: MatTableDataSource<SkillGraduated[]>; // data as MatTableDataSource

  @Output() skillsEvent = new EventEmitter<SkillGraduated[]>() ;
  
  constructor() {
  }

  /**
   * Inits dataSource of array : skills or soft skills
   */
  ngOnInit() {
  }

  ngOnDestroy(){
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
  /*applyFilterSkills(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }*/

  /**
  * Adds a skill into the array
  * @param  event skillName from input
  */
  addSkill(event) {
    if(event.target.value.trim() != '') {
      let skillName = event.target.value;

      // if skillname not already in array : add it
      if(this.dataSourceArray.findIndex(skillGraduated => skillGraduated.skill.name.toLowerCase().trim() === skillName.toLowerCase().trim()) == -1) {
        if(this.datatype == "softSkills") { // add isSoft field if soft skill
          let softSkill = new Skill(skillName);
          softSkill.isSoft = "";
          this.dataSourceArray.push(new SkillGraduated(softSkill, 1));
        }
        else {
          this.dataSourceArray.push(new SkillGraduated(new Skill(skillName), 1));
        }
        this.dataSource = new MatTableDataSource(this.dataSourceArray);

        this.updateDataSourceInService();
      }
      event.target.value = '';
    }
  }

  /**
  * Removes a skill from the array
  * @param  event button clicked in skill row
  */
  removeSkill(event) {
    let skillName = event.target.closest('tr').childNodes[1].innerText; // get skillName from row
    let skillIndex = this.dataSourceArray.findIndex(skillGraduated => skillGraduated.skill.name === skillName);

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

    this.dataSourceArray.forEach(function(skillGraduated) {
      if(skillGraduated.skill.name == skillName){
        if(grade == 1.5 && event.target.className == "incrementButton" ){
          skillGraduated.grade = 2
        } else if (grade == 1.5 && event.target.className == "decrementButton") {
          skillGraduated.grade = 1
        } else {
          skillGraduated.grade = +grade;
        }
      }
    });

    this.updateDataSourceInService();

  }

  /**
  * Updates skills or softSkills array in skills service
  */
  updateDataSourceInService() {
    this.checkGradeValues();
    this.skillsEvent.emit(this.dataSourceArray) ;
  }

  /**
   * Check if every grade is valid before sending to service
   * If grade invalid, set to 1
   */
  checkGradeValues() {
    let pattern: string = "^([1-3]([\\.|,]5)?)$|^4$"; // number between 1 and 4 (step 0,5) or 0

    this.dataSourceArray.forEach(function(skillGraduated) {
      if(!skillGraduated.grade.toString().match(pattern)) {
        skillGraduated.grade = 1;
      }
    });
  }
}
