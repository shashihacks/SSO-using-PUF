import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';


import { User } from '../models/user';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    public loginResponse: string = ''
    private currentUserSubject: BehaviorSubject<any>;
    public currentUser: Observable<any>;
    public returnUrl: string
    public deviceInfo
    constructor(private toaster: ToastrService,
        private deviceService: DeviceDetectorService, private http: HttpClient, private router: Router, private db: AngularFirestore) {
        this.currentUserSubject = new BehaviorSubject(localStorage.getItem('accessToken'));
        this.currentUser = this.currentUserSubject.asObservable();
        this.deviceInfo = this.deviceService.getDeviceInfo()
    }

    public get currentUserValue() {
        return this.currentUserSubject.value;
    }

    get device(): any {
        return this.deviceService.getDeviceInfo();
    }

    get isMobile(): boolean {
        return this.deviceService.isMobile();
    }

    get isTablet(): boolean {
        return this.deviceService.isTablet();
    }

    get isDesktop(): boolean {
        return this.deviceService.isDesktop();
    }


    login(email: string, password: string) {

        // this.dblogin(username, password)
        const deviceName = this.isDesktop ? 'Desktop' : this.isTablet ? 'Tablet' : this.isMobile ? 'Mobile' : 'Unknown'

        console.log(this.deviceInfo, "Info")
        this.deviceInfo['device'] = deviceName
        this.deviceInfo['loginType'] = 'Email'

        this.http.post(`${environment.apiUrl}/api/login`, { "email": email, "password": password, deviceInfo: this.deviceInfo }).subscribe(response => {

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

    loginWithPuf(puf_token: string, redirection) {
        console.log("trying with redirection", redirection)
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
            localStorage.removeItem('redirectUrl')
            localStorage.removeItem('isRedirection')
            localStorage.removeItem('clientId')

            this.currentUserSubject.next(null);
            this.router.navigateByUrl('/login')
        })


    }


}