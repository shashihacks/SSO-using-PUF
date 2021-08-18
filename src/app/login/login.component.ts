import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AccountService } from '../services/account.service';
import { LocalStorageService } from '../services/local-storage.service';

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

  constructor(
    private router: Router,
    private formBuilder: FormBuilder, private accountService: AccountService, private storageService: LocalStorageService) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })

  }
  get f() { return this.form.controls; }

  onSubmit() {

    console.log(this.form.value)
    const { email } = this.form.value
    // this.accountService.loginUser(this.form.value)
    this.loggedInSubscription = this.accountService.loginUser(this.form.value).subscribe(document => {
      console.log(document.exists)
      if (document.exists) {

        this.accountService.loggedInStatus = true
        this.storageService.setCookie(this.form.value)

        this.router.navigate(['/'])
      }
      else
        this.accountService.loggedInStatus = false
    })
    console.log(this.accountService.loggedInStatus)


  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.loggedInSubscription.unsubscribe()
  }
}
