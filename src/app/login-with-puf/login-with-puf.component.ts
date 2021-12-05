import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../services';
import { AccountService } from '../services/account.service';
@Component({
  selector: 'app-login-with-puf',
  templateUrl: './login-with-puf.component.html',
  styleUrls: ['./login-with-puf.component.scss']
})
export class LoginWithPufComponent implements OnInit {
  form: FormGroup;
  loading = false;
  submitted = false;
  loggedInSubscription: Subscription;
  loginForm: FormGroup;
  returnUrl: string = '/';
  reDirection: boolean = false;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private formBuilder: FormBuilder, private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      token: ['', [Validators.required, Validators.minLength(6)]]
    })

    this.authenticationService.currentUser.subscribe(userObject => {
      if (userObject)
        this.router.navigate(['/home'])
    })


    this.route.queryParams.subscribe(params => {
      const { redirectUrl, clientId } = params
      console.log(redirectUrl, clientId)
      if (redirectUrl && clientId)
        this.reDirection = true
    })


  }

  get f() { return this.form.controls; }



  onSubmit() {
    console.log(this.f)
    console.log(this.f.token.value)
    const token = this.f.token.value
    let response = this.authenticationService.loginWithPuf(token)

    this.form.reset()

    this.authenticationService.currentUser.subscribe(userObject => {
      if (this.reDirection)
        this.route.queryParams.subscribe(params => {
          console.log(params)

          //if user is coming  with redirectUrl and clientId  
          this.authenticationService.currentUser.subscribe(userObject => {
            if (userObject) {
              this.route.queryParams.subscribe(async params => {
                console.log(params, userObject)
                const { redirectUrl, clientId } = params
                if (redirectUrl && clientId) {
                  let userData
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
        })
    })

    // this.router.navigate(['/home'])
  }
}
