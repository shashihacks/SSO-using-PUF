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

  apps = []
  update: boolean = false
  currentUpdateIndex: number
  form: FormGroup;
  constructor(
    private toaster: ToastrService,
    private formBuilder: FormBuilder, private accountService: AccountService) {

    // this.accountService.getUserInfo().subscribe(response => {
    //   console.log(response, "application")
    //   // this.apps = response['data']
    // })
    console.log(this.accountService.userSettings['settings']['applications'], "intial")
    if (Object.keys(this.accountService.userSettings).length === 0 || this.accountService.userSettings['settings']['applications'] === undefined) {

      this.apps = []
    }
    else
      this.apps = this.accountService.userSettings['settings']['applications']


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
    // this.form.value['id'] = Date.now()
    this.accountService.addApplication(this.form.value).subscribe(response => {
      if (response['sendStatus'] == 200 && response['text']) {
        this.toaster.success(response['text'])
        console.log(this.form.value, this.apps, typeof (this.apps))
        this.apps.push(this.form.value)
        this.form.reset()
      }
      else {
        this.toaster.info('Something went wrong')
        this.form.reset()
      }
    })

  }


  editApp(index, appName, appUrl) {
    console.log(this.apps)
    console.log(index, "edit", appName)
    appName.value = this.apps[index]['name']
    appUrl.value = this.apps[index]['url']
    this.currentUpdateIndex = index

  }
  updateApp(name, url) {
    console.log(this.currentUpdateIndex)
    if (this.currentUpdateIndex === undefined || this.currentUpdateIndex === null) return
    console.log(this.currentUpdateIndex, "to update", name, url)

    this.accountService.updateApp(this.currentUpdateIndex, name, url).subscribe(response => {
      console.log("update response", response)
      if (response['sendStatus'] === 200) {
        console.log(this.apps, "current")
        this.apps[this.currentUpdateIndex]['name'] = name
        this.apps[this.currentUpdateIndex]['url'] = url
        // this.apps = response['data']
        this.toaster.success(response['text'])
      }
    })



    this.update = false
    this.form.reset()
  }


  deleteApp(index, app) {
    console.log(app, index)
    this.accountService.deleteApp(index, app).subscribe(response => {
      if (response['sendStatus'] === 201) {
        this.apps.splice(index, 1)
        this.toaster.success(response['text'])
      }
    })



  }


  trackByIndex(index, item) {
    return index;
  }

}
