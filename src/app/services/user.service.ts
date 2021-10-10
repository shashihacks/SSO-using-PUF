import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { User } from '../models/user';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<any>(`${environment.apiUrl}/users`);
    }

    getPosts() {
        return this.http.get<any>(`${environment.apiUrl}/api/posts`).subscribe(posts => {
            console.log(posts)
            return posts
        })
    }



}
