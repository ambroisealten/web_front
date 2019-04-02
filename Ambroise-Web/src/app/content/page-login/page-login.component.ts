import { Component, OnInit } from '@angular/core';
import { AuthGuard } from 'src/app/services/auth-guard.service';

@Component({
  selector: 'app-page-login',
  templateUrl: './page-login.component.html',
  styleUrls: ['./page-login.component.css']
})
export class PageLoginComponent implements OnInit {

  constructor(private authGuard : AuthGuard) {
    authGuard.unsetActive();
   }

  ngOnInit() {
  }

}
