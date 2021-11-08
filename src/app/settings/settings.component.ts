import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { AccountService } from '../services/account.service';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthSettingsComponent } from './auth-settings/auth-settings.component';
import { ApplicationsComponent } from './applications/applications.component';
ApplicationsComponent
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  form: FormGroup;
  item: string = 'Profile'
  user: any = {}
  submitted = false;
  constructor(
    private router: Router,
    private toaster: ToastrService,
    private accountService: AccountService, private formBuilder: FormBuilder,) {

    this.accountService.getUserInfo().subscribe(info => {
      this.user = info
      console.log(this.user)
    })

  }

  ngOnInit(): void {


    this.form = this.formBuilder.group({
      email: ['', Validators.required, Validators.email],
      firstName: ['', [Validators.required]],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['',]

    })

    this.form.get('email').disable();

  }


  changeItem(name) {
    this.item = name
    if (this.item == 'Profile')
      this.accountService.getUserInfo().subscribe(info => {
        this.user = info
        console.log(this.user)
      })
  }
  get f() { return this.form.controls; }

  save() {
    this.submitted = true
    console.log(this.form)
    if (this.form.invalid)
      return
    this.accountService.updateUser(this.user).subscribe(response => {
      if (response && response['sendStatus'] == 201 && response['text']) {
        this.toaster.success(response['text'])

      }
    })
    console.log(this.user)

  }

  cancel() {
    this.router.navigate(['/home'])
  }
}
