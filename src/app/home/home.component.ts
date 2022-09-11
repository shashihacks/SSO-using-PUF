import { Component, OnInit } from '@angular/core';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public accountService: AccountService) {
    console.log("Home loaded")
  }

  ngOnInit(): void {
    let redirectUrl = localStorage.getItem('redirectUrl')
    let clientId = localStorage.getItem('clientId')
    let isRedirected = localStorage.getItem('isRedirected')
    console.log(redirectUrl, clientId)
    console.log(isRedirected, typeof (isRedirected), clientId)
    if (redirectUrl && parseInt(isRedirected) == 1 && clientId) {
      localStorage.removeItem(isRedirected)
      this.accountService.getUserData().subscribe(data => {
        let firstName = data['firstName']
        let lastName = data['lastName']
        let email = data['email']
        let HMAC = data['HMAC']

        console.log(data)
        localStorage.removeItem('isRedirected')
        window.location.href = redirectUrl + '?firstName=' + firstName + '&lastName=' + lastName + '&email=' + email + '&HMAC=' + HMAC


      })
    }

  }

}
