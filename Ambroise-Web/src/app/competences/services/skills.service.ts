import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Skills } from '../models/skills';
import { SkillsSheet } from '../models/skillsSheet';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { timeout, catchError } from 'rxjs/operators';
import { LoggerService, LogLevel } from 'src/app/services/logger.service';
import { ErrorService } from 'src/app/services/error.service';
import { HttpHeaderService } from 'src/app/services/httpHeaderService';

@Injectable()
/**
* Service to handle Skills models
*/
export class SkillsService {

    private skillsInformation = new BehaviorSubject(undefined);
    skillsObservable = this.skillsInformation.asObservable();

    constructor(private httpClient: HttpClient,
        private errorService: ErrorService,
        private httpHeaderService: HttpHeaderService) { }

    notifySkills(skills: Skills){
        this.skillsInformation.next(skills);
    }

    resetSkills(){
        this.skillsInformation.next(undefined);
    }

    getAllSkills(noCompFilter:string[], compFilter: string[], sortColumn: string):Observable<{} | Skills[]>{

       let options = this.httpHeaderService.getHttpHeaders() ;

        let noComp: string = "";
        noCompFilter.forEach(filter => {
            noComp += filter+","
        })
        if(noComp == ""){
            noComp = ","
        }

        let comp: string = "";
        compFilter.forEach(filter => {
            if(filter.includes('#')){
                let i = filter.indexOf('#')
                if( i == filter.length-1 ){
                    filter = filter.substr(0,i) + "%23"
                } else if (i == 0 ) {
                    filter = "%23" + filter.substr(1) ; 
                } else {
                    filter = filter.substr(0,i) + "%23" + filter.substr(i+1) ; 
                }
            }
            comp += filter+','
        })
        if(comp== ""){
            comp = ","
        } 

        if(sortColumn == ""){
            sortColumn =","
        }

        return this.httpClient
            .get<{} | Skills[]>(environment.serverAddress + '/skillsheetSearch/'+noComp+"/"+comp+"/" + sortColumn, options)
            .pipe(timeout(5000), catchError(error => this.errorService.handleError(error)));
      }

}
