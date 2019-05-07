import { Component, OnInit, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-array-skillsUpdates',
  templateUrl: './array-skillsUpdates.component.html',
  styleUrls: ['./array-skillsUpdates.component.scss']
})
/**
 * Component containing an array containing info about the updates of a skillsSheet
 */
export class ArraySkillsUpdatesComponent implements OnInit {

  @Input() displayedColumns: string[]; // names of columns to display
  @Input() dataSource: MatTableDataSource<any[]>; // data array
  @Input() headerRowHidden: boolean; // is header row (columns title) hidden

  //dataSource: MatTableDataSource<any[]>; // data as MatTableDataSource

  constructor() { }

  ngOnInit() {
    //this.dataSource = new MatTableDataSource(this.dataSourceArray);
  }

}
