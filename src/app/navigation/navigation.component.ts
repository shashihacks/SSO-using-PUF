import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { AuthenticationService } from '../services';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  isLoggedIn: boolean = false
  currentUser: User
  constructor(private accountService: AccountService,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.isLoggedIn = this.accountService.loggedInStatus
    console.log(this.isLoggedIn, "from nav")
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit(): void {
  }

  onLogout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

}
