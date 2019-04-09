import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material';
import { SkillsService } from 'src/app/services/skills.service';

@Component({
  selector: 'app-array-skills',
  templateUrl: './array-skills.component.html',
  styleUrls: ['./array-skills.component.scss']
})
export class ArraySkillsComponent implements OnInit {

  @Input() displayedColumns: string[];
  @Input() dataSourceArray: any[];
  @Input() headerRowHidden: boolean;
  @Input() datatype: string;

  @Output() messageEvent = new EventEmitter<string>();

  dataSource: MatTableDataSource<any[]>;
  dataSourceSplit: MatTableDataSource<any[]>;

  isArraySplit: boolean = false;

  constructor(private skillsService: SkillsService) { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.dataSourceArray);
  }

  applyFilterSkills(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addSkill(event) {
    if(event.target.value != '') {
      this.dataSourceArray.push({skillName: event.target.value, grade: '0'});
      this.dataSource = new MatTableDataSource(this.dataSourceArray);

      this.updateDataSourceInService();

      // send message event to parent to update matrixes
      this.messageEvent.emit(this.datatype);
    }
  }

  updateGradeEvent(event) {
    let skillName = event.target.parentElement.parentElement.parentElement.childNodes[1].innerText;
    let grade = event.target.parentElement.childNodes[1].value;
    this.dataSourceArray.forEach(function(skill) {
      if(skill.skillName == skillName)
        skill.grade = grade;
    });

    this.updateDataSourceInService();

    this.messageEvent.emit(this.datatype);
  }

  updateDataSourceInService() {
    if(this.datatype == "skills")
      this.skillsService.updateSkills(this.dataSourceArray);
    else
      this.skillsService.updateSoftSkills(this.dataSourceArray);
  }
}
