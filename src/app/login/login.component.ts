import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../services';
import { AccountService } from '../services/account.service';
import { LocalStorageService } from '../services/local-storage.service';
import { first } from 'rxjs/operators';
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

  returnUrl: string;
  error = '';
  constructor(

    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {


    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })

  }
  get f() { return this.form.controls; }

  onSubmit() {

    this.submitted = true;

    console.log(this.f)
    this.loading = true;
    this.authenticationService.login(this.f.email.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        data => {
          console.log(data)
          // this.router.navigate([this.returnUrl]);
          this.route.queryParams.subscribe(params => {
            console.log(params)
            const { returnUrl } = params
            if (returnUrl && params)
              this.router.navigate([returnUrl])
            else
              this.router.navigate([this.returnUrl])

          })
        },
        error => {
          this.error = error;
          this.loading = false;
        });
  }


}


