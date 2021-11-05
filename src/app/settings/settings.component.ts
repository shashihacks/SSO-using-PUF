import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { AccountService } from '../services/account.service';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  form: FormGroup;
  item: string = 'Profile'
  user: any = {}

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
      email: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: ['', Validators.required],

      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required]

    })

    this.form.get('email').disable();

  }


  changeItem(name) {
    this.item = name
  }
  get f() { return this.form.controls; }

  save() {
    this.accountService.updateUser(this.user).subscribe(response => {
      if (response && response['sendStatus'] == 201 && response['text']) {
        this.toaster.success(response['text'])
        this.router.navigate(['/home'])
      }
    })
    console.log(this.user)

  }

  cancel() {
    this.router.navigate(['/home'])
  }
}
