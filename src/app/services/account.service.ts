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
  userSettings: any
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

  deleteAccount() {
    console.log('Delete account requested')
    let accoundeDeleteSubject = new Subject<Object>();

    this.http.delete(`${environment.apiUrl}/api/settings/delete-account`).subscribe(response => {
      console.log(response)
      accoundeDeleteSubject.next(response)

    })


    return accoundeDeleteSubject.asObservable()
  }
  registerAccount(data) {
    console.log(data)
    const { email } = data
    data['settings'] = {
      emailAndPass: true, pufResponse: true
    }
    this.db.collection("users").doc(email).set(data).then((docRef) => {
      console.log('document written', docRef)
    }).catch((error) => {
      console.error("Error adding document", error)
    });

  }


  //Not used
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

    this.http.post(`${environment.apiUrl}/api/sso/share-userdata`, { "token": this.token }).subscribe(response => {
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

    this.http.post(`${environment.apiUrl}/api/settings/userinfo`, { "token": this.token }).subscribe(response => {
      console.log(response, "user info data")
      this.userSettings = response
      userInfoSubject.next(response)

    })
    return userInfoSubject.asObservable()
  }


  updateUser(user): Observable<Object> {
    console.log('update user info requested')
    let userDataSubject = new Subject<Object>();
    this.http.post(`${environment.apiUrl}/api/settings/updateuser`, { "token": this.token, user }).subscribe(response => {
      console.log(response)
      userDataSubject.next(response)

    })

    return userDataSubject.asObservable();
  }

  getUserAuthSettings(): Observable<Object> {
    console.log("Authsettings requested")
    let userAuthSettingsSubject = new Subject<Object>();
    this.http.post(`${environment.apiUrl}/api/settings/auth`, { "token": this.token }).subscribe(response => {
      console.log("response from server", response)
      userAuthSettingsSubject.next(response)

    })

    return userAuthSettingsSubject.asObservable()

  }


  updateAuthSettings(settings) {
    console.log("Authsettings requested")
    let updateAuthSettingsSubject = new Subject<Object>();
    this.http.post(`${environment.apiUrl}/api/settings/updateauth`, { "token": this.token, settings }).subscribe(response => {
      console.log("response from server", response)
      updateAuthSettingsSubject.next(response)

    })

    return updateAuthSettingsSubject.asObservable()
  }



  addApplication(appData) {

    let addAppSubject = new Subject<Object>();
    this.http.post(`${environment.apiUrl}/api/settings/add-app`, { "token": this.token, appData }).subscribe(response => {
      console.log("response from server", response)
      addAppSubject.next(response)

    })

    return addAppSubject.asObservable()
  }




  getApplications() {
    console.log("get application data requested")
    let getAppSubject = new Subject<Object>();
    this.http.post(`${environment.apiUrl}/api/settings/get-apps`, { "token": this.token }).subscribe(response => {
      console.log("response from server", response)
      getAppSubject.next(response)

    })

    return getAppSubject.asObservable()

  }

  updateApp(index, name, url) {
    let updateAppSubject = new Subject<Object>();

    this.http.post(`${environment.apiUrl}/api/settings/update-app`, { "token": this.token, data: { name, url, index } }).subscribe(response => {
      console.log("response from server", response)
      updateAppSubject.next(response)

    })



    return updateAppSubject.asObservable()

  }

  deleteApp(index, app) {
    let deleteAppSubject = new Subject<Object>();
    this.http.post(`${environment.apiUrl}/api/settings/delete-app`, { "token": this.token, data: app }).subscribe(response => {
      console.log("response from server", response)
      deleteAppSubject.next(response)

    })
    return deleteAppSubject.asObservable()
  }


  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
  }
}
