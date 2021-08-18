import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationComponent } from './navigation/navigation.component';
import { environment } from "src/environments/environment";


// 1. Import the libs you need
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// import { BrowserModule } from '@angular/platform-browser';

import { JwtInterceptor } from './helpers/jwt.interceptor';
import { fakeBackendProvider } from './helpers/fake-backend';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
JwtInterceptor
console.log(environment)

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    NavigationComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    MDBBootstrapModule.forRoot(),
    BrowserAnimationsModule,
    AngularFirestoreModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    FormsModule, ReactiveFormsModule

  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },


    // provider used to create fake backend
    fakeBackendProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
