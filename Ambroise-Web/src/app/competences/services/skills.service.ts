import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { ErrorService } from 'src/app/services/error.service';
import { HttpHeaderService } from 'src/app/services/httpHeaderService';
import { environment } from 'src/environments/environment';
import { Skills } from '../models/skills';

@Injectable()
/**
* Service to handle Skills models
*/
export class SkillsService {

    private skillsInformation = new BehaviorSubject(undefined);
    skillsObservable = this.skillsInformation.asObservable();

    constructor(
        private httpClient: HttpClient,
        private errorService: ErrorService,
        private httpHeaderService: HttpHeaderService) { }

    notifySkills(skills: Skills) {
        this.skillsInformation.next(skills);
    }

    resetSkills() {
        this.skillsInformation.next(undefined);
    }

    getAllSkills(noCompFilter: string[], compFilter: string[], sortColumn: string): Observable<{} | Skills[]> {

       const options = this.httpHeaderService.getHttpHeaders() ;

       let noComp = '';
       noCompFilter.forEach(filter => {
            filter = encodeURIComponent(filter) ;
            noComp += filter +','
        });
       if (noComp == '') {
            noComp = ','
        }

       let comp = '';
       compFilter.forEach(filter => {
           filter = encodeURIComponent(filter) ;
           comp += filter + ',';
        });
       if (comp == '') {
            comp = ','
        }

       if (sortColumn == '') {
            sortColumn = ",";
        }

       return this.httpClient
            .get<{} | Skills[]>(environment.serverAddress + '/skillsheetSearch/' + noComp + '/' + comp + '/' + encodeURIComponent(sortColumn), options)
            .pipe(retry(), catchError(error => this.errorService.handleError(error)));
      }

}
