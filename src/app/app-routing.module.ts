import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthGuard } from './helpers';
import { HomeComponent } from './home/home.component';
import { IdpComponent } from './idp/idp.component';
import { LoginWithPufComponent } from './login-with-puf/login-with-puf.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
  { path: '', component: AppComponent, },
  { path: 'login', component: LoginComponent, },
  { path: 'login-with-puf', component: LoginWithPufComponent, },
  { path: 'register', component: RegisterComponent },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent },
  { path: 'via_client/:id/:url', component: IdpComponent, canActivate: [AuthGuard] },
  { path: 'via_client', component: IdpComponent, canActivate: [AuthGuard] },

  // { path: 'via_idp/:id', component: IdpComponent, },



  // otherwise redirect to home
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
