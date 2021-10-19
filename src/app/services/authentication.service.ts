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
    public loginResponse: string = ''
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


        this.http.post(`${environment.apiUrl}/api/login`, { "email": email, "password": password }).subscribe(response => {

            if (response['accessToken'] && response['accessToken'] != '') {
                localStorage.setItem('accessToken', response['accessToken']);
                localStorage.setItem('refreshToken', response['refreshToken']);

                this.currentUserSubject.next(response['accessToken']);
                this.loginResponse = response['text']
            }
            else
                this.loginResponse = response['text']

        })
    }

    loginWithPuf(puf_token: string) {

        return this.http.post(`${environment.apiUrl}/api/login-with-puf`, { "puf_token": puf_token }).subscribe(response => {
            console.log(response, "from server")
            localStorage.setItem('accessToken', response['accessToken']);
            localStorage.setItem('refreshToken', response['refreshToken']);
            this.currentUserSubject.next(response['accessToken']);

            if (response['accessToken'] && response['refreshToken'])
                return true
            else
                return false
        })
    }



    logout() {
        // remove user from local storage to log user out
        let refreshToken = localStorage.getItem('refreshToken');
        this.http.post(`${environment.apiUrl}/api/logout`, { "token": refreshToken }).subscribe(response => {
            console.log(response, "from server")
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');

            this.currentUserSubject.next(null);
            this.router.navigateByUrl('/login')
        })


    }


}