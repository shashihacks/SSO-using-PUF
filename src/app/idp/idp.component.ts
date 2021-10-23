import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../services';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-idp',
  templateUrl: './idp.component.html',
  styleUrls: ['./idp.component.scss']
})
export class IdpComponent implements OnInit {

  constructor(
    private accountService: AccountService,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService) {

    this.route.queryParams.subscribe(params => {
      console.log(params)

      //if already logged In
      this.authenticationService.currentUser.subscribe(userObject => {
        console.log(userObject)
        if (userObject != '' && userObject != undefined && Object.keys(userObject).length !== 0) {
          console.log(userObject)
          this.route.queryParams.subscribe(params => {
            console.log(params)
            const { redirectUrl, clientId } = params
            if (redirectUrl && clientId) {

              this.accountService.getUserData().subscribe(data => {
                let firstName = data['firstName']
                let lastName = data['lastName']
                console.log(data)
                window.location.href = redirectUrl + '?firstName=' + firstName + '&lastName=' + lastName + '&email=' + data['email'] + '&HMAC=' + data['HMAC']
              })

            }
            else {
              console.log("navigating to...")
              this.router.navigate(['/home'])
            }
          })
        }



      })



      this.router.navigateByUrl['/login']
    })









  }

  ngOnInit(): void {
  }

}
