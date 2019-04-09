import { Component, OnInit, Input } from '@angular/core';
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
      this.dataSourceArray.push({skillName: event.target.value, grade: ''});
      this.dataSource = new MatTableDataSource(this.dataSourceArray);

      if(this.datatype == "skills")
        this.skillsService.updateSkills(this.dataSourceArray);
      else
        this.skillsService.updateSoftSkills(this.dataSourceArray);
    }
  }
}
