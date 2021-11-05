import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AccountService {

  loggedInStatus: boolean

  token
  subject: Subject<Object>;
  constructor(private db: AngularFirestore, private http: HttpClient, private router: Router) {

    this.token = localStorage.getItem('accessToken')
    // console.log(this.status, "status check", localStorage.getItem('auth_token'))
    if (this.token == null)
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

  }

  //For SSO - fetch custom information
  getUserData(): Observable<Object> {
    console.log('account data requested')
    let userData
    this.subject = new Subject<Object>();

    this.http.post(`${environment.apiUrl}/api/sso-userdata`, { "token": this.token }).subscribe(response => {
      console.log(response)

      this.subject.next(response)

    })

    this.subject.subscribe(r => console.log(r))
    return this.subject.asObservable()
  }


  //For displaying user info in settings

  getUserInfo(): Observable<Object> {
    console.log('account data requested')
    let userData
    let userInfoSubject = new Subject<Object>();

    this.http.post(`${environment.apiUrl}/api/userinfo`, { "token": this.token }).subscribe(response => {
      console.log(response)

      userInfoSubject.next(response)

    })
    return userInfoSubject.asObservable()
  }


  updateUser(user): Observable<Object> {
    console.log('update user info requested')
    let userDataSubject = new Subject<Object>();
    this.http.post(`${environment.apiUrl}/api/updateuser`, { "token": this.token, user }).subscribe(response => {
      console.log(response)
      userDataSubject.next(response)

    })

    return userDataSubject.asObservable();
  }










  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
  }
}
