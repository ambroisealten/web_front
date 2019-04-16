import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { LoggerService, LogLevel } from 'src/app/services/logger.service';
import { timeout } from 'rxjs/operators';
import { HeaderModule } from '../header.module';
import { Menu } from '../models/menu';
import { environment } from 'src/environments/environment';

@Injectable()
export class HeaderService {

    private menuReceptionState = new BehaviorSubject(undefined);
    menuReceptionObservable = this.menuReceptionState.asObservable();


    constructor(private httpClient: HttpClient) {
    }

    init():Observable<Menu[]> {

        let token = window.sessionStorage.getItem("bearerToken");
        LoggerService.log("Appel de : init()", LogLevel.DEBUG);

        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token != "" ? token : '' // TO-DO : En attente du WebService Login pour la récuperation du token
        });
        let options = { headers: headers };

        return this.httpClient
            .get<Menu[]>(environment.serverAddress + '/configMenu', options)
            .pipe(timeout(5000))
            /*
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
            */

    }

    notifyMenusReceived(menu: Menu[]){
        this.menuReceptionState.next(menu) ; 
    }
}
