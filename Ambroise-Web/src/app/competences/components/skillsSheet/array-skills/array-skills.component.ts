import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { SkillsSheetService } from '../../../services/skillsSheet.service';

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

  @Output() messageEvent = new EventEmitter<string>(); // event when array is updated

  dataSource: MatTableDataSource<any[]>; // data as MatTableDataSource

  constructor(private skillsSheetService: SkillsSheetService) { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.dataSourceArray);
  }

  setToZeroIfEmptyOrInvalid($event) {
    let grade: string = $event.target.value;
    let pattern: string = "^([1-3]([\\.|,]5)?)$|^4$|^0$"; // number between 1 and 4 (step 0,5) or 0
    if(!grade.match(pattern) || $event.target.value == '')
    $event.target.value = 0;
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
      if(this.dataSourceArray.findIndex(skill => skill.skillName.toLowerCase().trim() === skillName.toLowerCase().trim()) == -1) {
        this.dataSourceArray.push({skillName: skillName, grade: '0'});
        this.dataSource = new MatTableDataSource(this.dataSourceArray);

        this.updateDataSourceInService();

        // send message event to parent to update matrixes
        this.messageEvent.emit(this.datatype);
      }
    }
  }

  /**
  * Removes a skill from the array
  * @param  event button clicked in skill row
  */
  removeSkill(event) {
    let skillName = event.target.closest('tr').childNodes[1].innerText; // get skillName from row
    let skillIndex = this.dataSourceArray.findIndex(skill => skill.skillName === skillName);

    this.dataSourceArray.splice(skillIndex, 1);
    this.dataSource = new MatTableDataSource(this.dataSourceArray);

    this.updateDataSourceInService();

    // send message event to parent to update matrixes
    this.messageEvent.emit(this.datatype);
  }

  /**
  * Handles the stepUp() and stepDown() functions for the grades in the array.
  * @param  event grade value from input
  */
  updateGradeEvent(event) {
    let skillName = event.target.closest('tr').childNodes[1].innerText; // get skillName from same row as modified grade
    let grade = event.target.parentElement.childNodes[1].value;

    this.dataSourceArray.forEach(function(skill) {
      if(skill.skillName == skillName)
      skill.grade = grade;
    });

    this.updateDataSourceInService();

    // send message event to parent to update matrixes
    this.messageEvent.emit(this.datatype);
  }

  /**
  * Updates skills or softSkills array in skills service
  */
  updateDataSourceInService() {
    if(this.datatype == "skills")
    this.skillsSheetService.updateSkills(this.dataSourceArray);
    else
    this.skillsSheetService.updateSoftSkills(this.dataSourceArray);
  }
}
