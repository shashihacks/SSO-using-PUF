import { Component, OnInit } from '@angular/core';
import { AccountService } from './services/account.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';


// Required for side-effects

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'sso-using-puf';
  user = false


  constructor(private accountService: AccountService, private db: AngularFirestore) {


    // this.db.collection("users").add({
    //   first: "Ada",
    //   last: "Lovelace",
    //   born: 1815
    // }).then(reponse => {
    //   console.log(reponse)
    // })
    // this.items = this.db.collection('users').valueChanges();
    // console.log(this.items, "items")

  }

  logout() {

  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    // console.log(this.db.collection('users').get().subscribe(res => console.log(res)))
    console.log(this.db.collection("users").get().subscribe((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
      });
    }));
  }



}
