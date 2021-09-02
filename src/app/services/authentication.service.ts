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

    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    public returnUrl: string
    constructor(private http: HttpClient, private router: Router, private db: AngularFirestore) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(username: string, password: string) {

        this.dblogin(username, password)


        return this.http.post<any>(`${environment.apiUrl}/users/authenticate`, { username, password })
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);


                return user;
            }));
    }

    async dblogin(username: string, password: string) {
        const email = username
        const pass = password
        console.log(email, pass)


        var docRef = this.db.collection("users").doc(email);

        docRef.get().subscribe((doc) => {
            if (doc.exists) {
                let data = doc.data()
                if (data['password'] === pass) {
                    console.log("success")
                }
                else {
                    console.log('invalid pass')
                }

            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        })


        console.log(this.db.collection("users").get().subscribe((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (doc.data()['email'] == 'shashisoft@outlook.com')
                    console.log(doc.data(), "got")
                // console.log(`${doc.id} => ${doc.data()}`);
            });
        }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
}