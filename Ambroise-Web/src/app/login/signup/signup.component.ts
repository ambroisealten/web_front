import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as sha512 from 'js-sha512';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  userName: string;
  userFirstName: string;
  userEmail: string;
  userPswd: string;
  userPswdCheck: string;

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
  }

  OnSignup() {
    // password hash with sha512 before POST request
    let postParams = {
      mail: this.userEmail,
      pswd: sha512.sha512(this.userPswd),
    }

    // TODO change server ip
    // send user info to server
    this.httpClient.post('http://localhost:8080/login', postParams).subscribe(data => {
      // TODO redirect to application home
    }, error => {
      console.log(error); // if error getting the data
    });

    console.log("clicked " + this.userEmail + " " + this.userPswd);
  }

}
