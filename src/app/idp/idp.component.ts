import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../services';

@Component({
  selector: 'app-idp',
  templateUrl: './idp.component.html',
  styleUrls: ['./idp.component.scss']
})
export class IdpComponent implements OnInit {

  constructor(

    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService) {

    this.route.queryParams.subscribe(params => {
      console.log(params)

      //if already logged In
      this.authenticationService.currentUser.subscribe(userObject => {
        console.log(Object.keys(userObject))
        console.log(userObject)
        if (userObject != '' && userObject != undefined && Object.keys(userObject).length !== 0) {
          console.log(userObject)
          this.route.queryParams.subscribe(params => {
            console.log(params)
            const { redirectUrl, clientId } = params
            if (redirectUrl && clientId) {
              window.location.href = redirectUrl + '?userdata=shashi@gmail.com'
            }
            else {
              console.log("navigating to...")
              this.router.navigate(['/home'])
            }
          })
        }



      })



      this.router.navigateByUrl['/login?']
    })









  }

  ngOnInit(): void {
  }

}
