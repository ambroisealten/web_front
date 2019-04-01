import { Injectable } from '@angular/core';

@Injectable()
export class SearchService {
    options: string[] = ['One', 'Two', 'Three','Java','JavaScript','JEE',"C","C++","C#","CPP"];

    filter(value: string): string[] {
        if(value.length === 0) return [];
        const filterValue = value.toLowerCase();
        let resulTab = this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0).sort((one, two) => (one < two ? -1 : 1));
        resulTab = (resulTab.length === 0) ? [] : resulTab;
        return resulTab;
      }

    getOptions(){
        /*
        * TO-DO : prendre les données dans la base (pas en local comme fait ici présent)
        */
        return this.options;
    }


}