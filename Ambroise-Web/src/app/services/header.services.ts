import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { LoggerService, LogLevel } from './logger.service';

@Injectable()
export class HeaderService {

    private currentModule: String;
    test: any;


    constructor(private httpClient: HttpClient) {
        this.currentModule = "Missions";
    }

    setCurrentModuleFromService(currentModule: String) {
        this.currentModule = currentModule;
    }

    getCurrentModuleFromService() {
        return this.currentModule;
    }

    getModulesFromService(callback) {
        let token = window.sessionStorage.getItem("bearerToken");
        LoggerService.log("appel de getModulesFromservice", LogLevel.DEBUG);
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token != "" ? token : '' // TO-DO : En attente du WebService Login pour la récuperation du token
        });

        let options = { headers: headers };
        this.httpClient
            .get('http://localhost:8080/configMenu' , options) //En attente du WebService Login pour la récuperation du token
            .subscribe(data => {
                callback(JSON.stringify(data));
            }, error => {
                console.log(error);// Error getting the data //TO-LOG
            });
    }

}