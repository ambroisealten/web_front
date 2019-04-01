import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { SearchService } from '../services/search.service';

@Component({
  selector: 'app-search-auto',
  templateUrl: './search-auto.component.html',
  styleUrls: ['./search-auto.component.scss'],
  providers : [SearchService]
})
export class SearchAutoComponent implements OnInit {
  myControl = new FormControl();
  filteredOptions: Observable<string[]>;
  options: string[];

  constructor(private SearchService : SearchService){
    this.options = this.SearchService.getOptions();
  }

  ngOnInit(){
    this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map(value => this.SearchService.filter(value))
      );
  }

}