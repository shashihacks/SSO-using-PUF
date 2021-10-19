import { Component, OnInit } from '@angular/core';
import { AccountService } from './services/account.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
// import { AuthenticationService } from './_services';

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

    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    // console.log(this.db.collection('users').get().subscribe(res => console.log(res)))
    // console.log(this.db.collection("users").get().subscribe((querySnapshot) => {
    //   querySnapshot.forEach((doc) => {
    //     console.log(doc.data(), "got")
    //     // console.log(`${doc.id} => ${doc.data()}`);
    //   });
    // }));
  }



}
