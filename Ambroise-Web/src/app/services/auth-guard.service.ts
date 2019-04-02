import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthGuard implements CanActivate {
  private isActive : boolean;
  private role : string;
    constructor(private router : Router){
      this.isActive = true;
      this.role = "admin";
    }

    /*
    * TO-DO : prendre en compte l'état de connexion de l'utilisateur pour savoir s'il a accès ou non au contenu demandé
    */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.isActive;
  }

  isActivated(){
    return this.isActive;
  }

  getRole(){  
    return this.role;
  }

  setRole(value : string){
    this.role = value;
  }

  setActive(value? : string){
    this.isActive = true;
    let role = (value === undefined) ? "admin" : value;
    this.setRole(role);
  }

  unsetActive(){
    this.isActive = false;
    this.setRole("");
  }
}