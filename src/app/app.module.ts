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
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor } from './helpers/error.interceptor';
import { fakeBackendProvider } from './helpers';
import { SettingsComponent } from './settings/settings.component';
import { HomeComponent } from './home/home.component';
import { IdpComponent } from './idp/idp.component';
import { ToastrModule } from 'ngx-toastr'

//JWT module

import { JwtModule } from '@auth0/angular-jwt';
import { LoginWithPufComponent } from './login-with-puf/login-with-puf.component';
import { AuthSettingsComponent } from './settings/auth-settings/auth-settings.component';
import { ApplicationsComponent } from './settings/applications/applications.component';

export function tokenGetter() {
  return localStorage.getItem('access_token');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    NavigationComponent,
    SettingsComponent,
    HomeComponent,
    IdpComponent,
    LoginWithPufComponent,
    AuthSettingsComponent,
    ApplicationsComponent

  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    MDBBootstrapModule.forRoot(),
    BrowserAnimationsModule,
    AngularFirestoreModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    FormsModule, ReactiveFormsModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
      }
    }),
    ToastrModule.forRoot()


  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

    // provider used to create fake backend
    // fakeBackendProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
