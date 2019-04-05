import { Component, OnInit, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-array-skills',
  templateUrl: './array-skills.component.html',
  styleUrls: ['./array-skills.component.scss']
})
export class ArraySkillsComponent implements OnInit {

  @Input() displayedColumns: string[];
  @Input() dataSource: MatTableDataSource<any[]>;
  @Input() headerRowHidden: boolean;

  constructor() { }

  ngOnInit() {
  }

}
