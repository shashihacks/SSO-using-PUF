import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  returnUrl: string = '/';
  constructor(private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder, private authenticationService: AuthenticationService) { }

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

    this.form.reset()

    this.authenticationService.currentUser.subscribe(userObject => {
      //   if (userObject) {
      //   //   this.route.queryParams.subscribe(params => {
      //   //     console.log(params)
      //   //     const { returnUrl } = params
      //   //     if (returnUrl && params) {
      //   //       console.log(returnUrl, typeof (returnUrl))
      //   //       if (returnUrl.includes('redirectUrl')) {
      //   //         console.log("yes contains")
      //   //         let url = decodeURIComponent(returnUrl.split('redirectUrl=')[1])
      //   //         console.log(url)
      //   //         window.location.href = url + '?userdata=shashi@gmail.com'
      //   //       }
      //   //       else {

      //   //       }
      //   //       this.router.navigate([returnUrl])
      //   //     }
      //   //     else {
      //   //       console.log("navigating to...")
      //   //       this.router.navigate(['/home'])
      //   //     }
      //   //   })
      //   // }
    })

    // this.router.navigate(['/home'])
  }
}
