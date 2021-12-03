import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Toast, ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services/account.service';
@Component({
  selector: 'app-auth-settings',
  templateUrl: './auth-settings.component.html',
  styleUrls: ['./auth-settings.component.scss']
})
export class AuthSettingsComponent implements OnInit {

  form: FormGroup;
  authSettings: Object = {}
  constructor(
    private toaster: ToastrService,
    private formBuilder: FormBuilder, private accountService: AccountService) {



  }

  ngOnInit(): void {

    this.form = this.formBuilder.group({
      emailAndPass: [],
      pufResponse: [],

    })
    const { emailAndPass, pufResponse } = this.accountService.userSettings['settings']
    this.authSettings['emailAndPass'] = emailAndPass
    this.authSettings['pufResponse'] = pufResponse
    console.log(this.authSettings, "Auth settings")


  }

  get f() { return this.form.controls; }


  update() {
    console.log("clicked save")
    console.log(this.form.value)
    this.accountService.updateAuthSettings(this.form.value).subscribe(response => {
      if (response['sendStatus'] == 201 && response['text'])
        this.toaster.success(response['text'])
      else
        this.toaster.info('Unable to update')

    })
  }
  cancel() {
    console.log("cancel")
  }




}
