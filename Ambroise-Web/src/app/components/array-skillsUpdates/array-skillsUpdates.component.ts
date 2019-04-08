import { Component, OnInit, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-array-skillsUpdates',
  templateUrl: './array-skillsUpdates.component.html',
  styleUrls: ['./array-skillsUpdates.component.scss']
})
export class ArraySkillsUpdatesComponent implements OnInit {

  @Input() displayedColumns: string[];
  @Input() dataSourceArray: any[];
  @Input() headerRowHidden: boolean;

  dataSource: MatTableDataSource<any[]>;

  constructor() { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.dataSourceArray);
  }

}
