import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { LoggerService, LogLevel } from './logger.service';
import { timeout } from 'rxjs/operators';

@Injectable()
export class HeaderService {

    private currentModule: String;
    private defaultModule = 'Missions';
    private menusJSON: any;

    private menuReceptionState = new BehaviorSubject(undefined);
    menuReceptionObservable = this.menuReceptionState.asObservable();


    constructor(private httpClient: HttpClient) {
        this.currentModule = this.defaultModule;
    }

    setCurrentModuleFromService(currentModule: String) {
        this.currentModule = currentModule;
    }

    getCurrentModuleFromService() {
        return this.currentModule;
    }

    init() {

        let token = window.sessionStorage.getItem("bearerToken");
        LoggerService.log("Appel de : init()", LogLevel.DEBUG);

        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token != "" ? token : '' // TO-DO : En attente du WebService Login pour la récuperation du token
        });
        let options = { headers: headers };

        this.httpClient
            .get('http://localhost:8080/configMenu', options)
            .pipe(timeout(5000))
            .toPromise()
            .then(headerMenus => {
                if (headerMenus != undefined) {
                    let menusJSON = JSON.parse(JSON.stringify(headerMenus));
                    this.menuReceptionState.next(menusJSON);
                }
            })
            .catch(error => {
                console.log(error)
                //  TO-DO : traitement des différentes erreurs timeout + HTTP
            });

    }
}
