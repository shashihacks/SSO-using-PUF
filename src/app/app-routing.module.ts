import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthGuard } from './helpers';
import { HomeComponent } from './home/home.component';
import { IdpComponent } from './idp/idp.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
  { path: '', component: AppComponent, },
  { path: 'login', component: LoginComponent, },
  { path: 'register', component: RegisterComponent },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'via_idp/:id/:url', component: IdpComponent, canActivate: [AuthGuard] },
  { path: 'via_idp', component: IdpComponent, canActivate: [AuthGuard] },

  // { path: 'via_idp/:id', component: IdpComponent, },



  // otherwise redirect to home
  { path: '**', redirectTo: 'via_idp' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
