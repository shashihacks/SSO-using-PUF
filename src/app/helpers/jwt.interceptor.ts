import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

import { AccountService } from '../services/account.service';
import { LocalStorageService } from '../services/local-storage.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private accountService: AccountService,
        private storageService: LocalStorageService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add auth header with jwt if user is logged in and request is to the api url
        // const currentUser = this.accountService.currentUserValue;
        let token = this.storageService.getToken()
        let isLoggedIn = this.accountService.loggedInStatus;
        isLoggedIn = true;
        const isApiUrl = request.url.startsWith(environment.apiUrl);
        if (isLoggedIn) {
            console.log("request cloned")
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(request)
        }

        return next.handle(request);
    }
}