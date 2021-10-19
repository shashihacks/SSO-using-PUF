import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../services';
import { AccountService } from '../services/account.service';
import { LocalStorageService } from '../services/local-storage.service';
import { first } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { map } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  loading = false;
  submitted = false;
  loggedInSubscription: Subscription;
  loginForm: FormGroup;

  returnUrl: string = '/';
  error = '';
  reDirection: boolean = false;
  constructor(
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    public authenticationService: AuthenticationService
  ) {

  }
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
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
    this.submitted = true;
    this.loading = true;
    this.authenticationService.login(this.f.email.value, this.f.password.value)
    if (this.reDirection)
      this.route.queryParams.subscribe(params => {
        console.log(params)

        //if user is coming from with redirectUrl and clientId  
        this.authenticationService.currentUser.subscribe(userObject => {
          if (userObject) {
            this.route.queryParams.subscribe(params => {
              console.log(params, userObject)
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
      })

    this.router.navigate(['/home'])
    this.form.reset()
  }
}


