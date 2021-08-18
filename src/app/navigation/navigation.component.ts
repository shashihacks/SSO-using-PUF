import { Component, OnInit } from '@angular/core';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  isLoggedIn: boolean = false
  constructor(private accountService: AccountService) {
    this.isLoggedIn = this.accountService.loggedInStatus
    console.log(this.isLoggedIn, "from nav")
  }

  ngOnInit(): void {
  }

  onLogout() {
    console.log("log out clicked")
  }

}
