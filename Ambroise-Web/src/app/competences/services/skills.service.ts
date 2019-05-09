import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Skills } from '../models/skills';
import { SkillsSheet } from '../models/skillsSheet';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { timeout, catchError } from 'rxjs/operators';
import { LoggerService, LogLevel } from 'src/app/services/logger.service';
import { ErrorService } from 'src/app/services/error.service';

@Injectable()
/**
* Service to handle Skills models
*/
export class SkillsService {

    private skillsInformation = new BehaviorSubject(undefined);
    skillsObservable = this.skillsInformation.asObservable();

    constructor(private httpClient: HttpClient,
        private errorService: ErrorService) { }
  
    notifySkills(skills: Skills){
        this.skillsInformation.next(skills);
    }

    resetSkills(){
        this.skillsInformation.next(undefined);
    }

    getAllSkills(noCompFilter:string[], compFilter: string[]):Observable<{} | Skills[]>{

        let token = window.sessionStorage.getItem("bearerToken");
        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': token != "" ? token : '' // TO-DO : En attente du WebService Login pour la récuperation du token
        });
        let options = { headers: headers };

        let noComp: string = "";
        noCompFilter.forEach(filter => {
            noComp += filter+","
        })
        if(noComp == ""){
            noComp = ","
        }

        let comp: string = "";
        compFilter.forEach(filter => {
            comp += filter+','
        })
        if(comp== ""){
            comp = ","
        }

        return this.httpClient
            .get<{} | Skills[]>(environment.serverAddress + '/skillsheetSearch/'+noComp+"/"+comp+"/", options)
            .pipe(timeout(5000), catchError(error => this.errorService.handleError(error)));
      }

}
