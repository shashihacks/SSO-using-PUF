import { Component, OnInit } from '@angular/core';
import { AccountService } from './services/account.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';



import { Router } from '@angular/router';
import { User } from './models/user';
import { AuthenticationService } from './services';
// Required for side-effects

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'sso-using-puf';
  user = false
  currentUser: User;
  deviceInfo = null;


  constructor(private accountService: AccountService, private db: AngularFirestore,
    private authenticationService: AuthenticationService,
    private router: Router,
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    console.log(this.currentUser, "currentUser")


  }




  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
  ngOnInit(): void {


  }



}
