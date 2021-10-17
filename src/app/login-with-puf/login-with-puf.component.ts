import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../services';
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

  constructor(private formBuilder: FormBuilder, private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      token: ['', [Validators.required, Validators.minLength(6)]]
    })


  }

  get f() { return this.form.controls; }



  onSubmit() {
    console.log(this.f)
    console.log(this.f.token.value)
    const token = this.f.token.value
    let response = this.authenticationService.loginWithPuf(token)
    console.log(response)
    this.form.reset()
  }
}
