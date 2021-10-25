import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { AccountService } from '../services/account.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  form: FormGroup;
  item: string = 'Profile'
  user: any = {
    firstName: "Alain",
    job: "dev"
  }

  constructor(private accountService: AccountService, private formBuilder: FormBuilder,) {

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
  }


  changeItem(name) {
    this.item = name
  }
  get f() { return this.form.controls; }

  save() {
    console.log(this.user)
  }
}
