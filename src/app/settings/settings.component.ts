import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  form: FormGroup;
  item: string = 'Profile'
  user: Object
  constructor(private accountService: AccountService, private formBuilder: FormBuilder,) {



  }

  ngOnInit(): void {
    this.accountService.getUserInfo().subscribe(info => {
      this.user = info
    })

    this.form = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: ['', Validators.required],

      lastName: ['', Validators.required],

    })
  }


  changeItem(name) {
    this.item = name
  }
  get f() { return this.form.controls; }

  save() {

  }
}
