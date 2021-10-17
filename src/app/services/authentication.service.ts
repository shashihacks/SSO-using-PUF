import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';


import { User } from '../models/user';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

    private currentUserSubject: BehaviorSubject<any>;
    public currentUser: Observable<any>;
    public returnUrl: string
    constructor(private http: HttpClient, private router: Router, private db: AngularFirestore) {
        this.currentUserSubject = new BehaviorSubject(localStorage.getItem('accessToken'));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue() {
        return this.currentUserSubject.value;
    }

    login(email: string, password: string) {

        // this.dblogin(username, password)


        return this.http.post(`${environment.apiUrl}/api/login`, { "email": email, "password": password }).subscribe(response => {
            console.log(response, "from server")

            localStorage.setItem('accessToken', response['accessToken']);
            this.currentUserSubject.next(response['accessToken']);
            localStorage.setItem('refreshToken', response['refreshToken']);
        })
    }

    loginWithPuf(puf_token: string) {

        return this.http.post(`${environment.apiUrl}/api/login-with-puf`, { "puf_token": puf_token }).subscribe(response => {
            console.log(response, "from server")
            localStorage.setItem('accessToken', response['accessToken']);
            this.currentUserSubject.next(response['accessToken']);
            localStorage.setItem('refreshToken', response['refreshToken']);
            return response
        })
    }

    dblogin(username: string, password: string) {
        const email = username
        const pass = password
        console.log(email, pass)

        let userdata: any
        let docRef = this.db.collection("users").doc(email);

        return docRef.get().subscribe((doc) => {
            if (doc.exists) {
                userdata = doc.data()
                if (userdata['password'] === pass) {
                    localStorage.setItem('currentUser', JSON.stringify(userdata));
                    this.currentUserSubject.next(userdata)
                    console.log("success")
                    return userdata
                }
                else {
                    console.log('invalid pass')
                }

            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
            return userdata
        })


        // console.log(this.db.collection("users").get().subscribe((querySnapshot) => {
        //     querySnapshot.forEach((doc) => {
        //         if (doc.data()['email'] == 'shashisoft@outlook.com')
        //             console.log(doc.data(), "got")
        //         // console.log(`${doc.id} => ${doc.data()}`);
        //     });
        // }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        this.currentUserSubject.next(null);
    }
}