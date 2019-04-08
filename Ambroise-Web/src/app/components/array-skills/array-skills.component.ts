import { Component, OnInit, Input } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material';

@Component({
  selector: 'app-array-skills',
  templateUrl: './array-skills.component.html',
  styleUrls: ['./array-skills.component.scss']
})
export class ArraySkillsComponent implements OnInit {

  @Input() displayedColumns: string[];
  @Input() dataSourceArray: any[];
  @Input() headerRowHidden: boolean;

  dataSource: MatTableDataSource<any[]>;

  constructor() { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.dataSourceArray);
  }

  applyFilterSkills(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addSkill(event) {
    this.dataSourceArray.push({skillName: event.target.value, grade: '?'});
    this.dataSource = new MatTableDataSource(this.dataSourceArray);
  }
}
