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

    private router: ActivatedRoute, private authenticationService: AuthenticationService) {

    console.log(this.authenticationService.returnUrl, "from idp")
    this.router.queryParams.subscribe(params => {
      console.log(params)
      const { redirectUrl } = params
      window.location.href = redirectUrl + "?userdata=shashi@gmail.com"

    })

  }

  ngOnInit(): void {
  }

}
