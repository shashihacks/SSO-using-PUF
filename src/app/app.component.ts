import { Component } from '@angular/core';
import { AccountService } from './services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'sso-using-puf';
  user = false
  constructor(private accountService: AccountService) {



  }

  logout() {

  }
}
