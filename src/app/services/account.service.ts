import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AccountService {

  loggedInStatus: boolean

  status
  constructor(private db: AngularFirestore) {

    this.status = localStorage.getItem('auth_token')
    // console.log(this.status, "status check", localStorage.getItem('auth_token'))
    if (this.status == null)
      this.loggedInStatus = false
    else
      this.loggedInStatus = true


    console.log(this.loggedInStatus, "from service")
  }


  registerAccount(data) {
    console.log(data)
    const { firstName, lastName, email, phone, password } = data
    this.db.collection("users").doc(email).set(data).then((docRef) => {
      console.log('document written', docRef)
    }).catch((error) => {
      console.error("Error adding document", error)
    });

  }


  loginUser(data) {
    const { email } = data
    let docRef = this.db.collection("users").doc(email).get(email)
    return docRef

    // docRef.get(email).subscribe(document => {
    //   if(document.exists)
    //     this.loggedInStatus = true
    //   else 
    //     this.loggedInStatus = false
    // })

  }











  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
  }
}
