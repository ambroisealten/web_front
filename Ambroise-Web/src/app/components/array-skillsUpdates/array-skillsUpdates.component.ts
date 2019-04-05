import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-array-skillsUpdates',
  templateUrl: './array-skillsUpdates.component.html',
  styleUrls: ['./array-skillsUpdates.component.scss']
})
export class ArraySkillsUpdatesComponent implements OnInit {

  @Input() displayedColumns: string[];
  @Input() dataSource: any[];
  @Input() headerRowHidden: boolean;

  constructor() { }

  ngOnInit() {
  }

}
