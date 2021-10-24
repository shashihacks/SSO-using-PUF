import { Component, OnInit } from '@angular/core';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  item: string = 'Profile'
  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
    this.accountService.getUserInfo().subscribe(info => {
      console.log(info)
    })
  }


  changeItem(name) {
    this.item = name
  }
}
