import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { AccountService } from 'src/app/services/account.service';
@Component({
  selector: 'app-auth-settings',
  templateUrl: './auth-settings.component.html',
  styleUrls: ['./auth-settings.component.scss']
})
export class AuthSettingsComponent implements OnInit {

  form: FormGroup;
  authSettings: Object = {}
  constructor(private formBuilder: FormBuilder, private accountService: AccountService) {



  }

  ngOnInit(): void {

    this.form = this.formBuilder.group({
      emailAndPass: [],
      pufResponse: [],

    })

    this.accountService.getUserAuthSettings().subscribe(response => {
      console.log("settings", response)
      if (response == null || response == undefined)
        this.authSettings = {}
      else
        this.authSettings = response
    })


  }

  get f() { return this.form.controls; }


  update() {
    console.log("clicked save")
    console.log(this.form)
  }
  cancel() {
    console.log("cancel")
  }

}
