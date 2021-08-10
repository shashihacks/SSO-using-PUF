import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/firestore';
@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private db: AngularFirestore) { }

  registerAccount(data) {
    console.log(data)
    const { firstName, lastName, email, phone, password } = data
    this.db.collection("users").doc(email).set(data).then((docRef) => {
      console.log('document written', docRef)
    }).catch((error) => {
      console.error("Error adding document", error)
    });
    // this.db.collection("users").add({
    //   firstName,
    //   lastName,
    //   email,
    //   phone,
    //   password
    // }).then(reponse => {
    //   console.log(reponse)
    // })

  }


  loginUser(data) {
    const { email } = data
    let docRef = this.db.collection("users").doc(email)
    docRef.get().subscribe((document) => {
      if (document.exists)
        console.log("User exists")
      else
        console.log("Does'nt exist")
    })


  }
}
