import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss']
})
export class ApplicationsComponent implements OnInit {

  apps: any = [{
    'name': 'Service Provider',
    'url': 'http://service-provider.com'
  }

  ]
  form: FormGroup;
  constructor(
    private toaster: ToastrService,
    private formBuilder: FormBuilder, private accountService: AccountService) {

    // this.accountService.getApplications().subscribe(response => {
    //   console.log(response)
    //   this.apps = response['data']
    // })

  }

  ngOnInit(): void {


    this.form = this.formBuilder.group({
      name: ['',],
      url: ['',],

    })


  }
  get f() { return this.form.controls; }


  cancel() {

  }

  add() {
    console.log(this.form)
    this.accountService.addApplication(this.form.value).subscribe(response => {
      if (response['sendStatus'] == 200 && response['text'])
        this.toaster.success(response['text'])
      else
        this.toaster.info('Something went wrong')
    })

  }

}
