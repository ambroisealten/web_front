import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as sha512 from 'js-sha512';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  userEmail: string;
  userPswd: string;

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
  }

  onConnect() {
    // password hash with sha512 before POST request
    let postParams = {
      mail: this.userEmail,
      pswd: sha512.sha512(this.userPswd),
    }

    // TODO change server ip
    // send mail and hashed pswd to server and add received token to sessionStorage
    this.httpClient.post('http://localhost:8080/login', postParams).subscribe(data => {
      window.sessionStorage.setItem("bearerToken",JSON.parse(JSON.stringify(data))["token"]);
    }, error => {
      console.log(error); // if error getting the data
    });

    console.log("clicked " + this.userEmail + " " + this.userPswd);
  }

}
