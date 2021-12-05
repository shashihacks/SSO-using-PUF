import { Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CollapseComponent } from 'angular-bootstrap-md';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss']
})
export class SecurityComponent implements OnInit {
  @ViewChildren(CollapseComponent) collapses: CollapseComponent[];
  elementClicked: string;
  form: FormGroup;
  down = true
  logArrowDown = true
  steps = [{
    title: 1,
    label: "Email"
  }, {
    title: 2,
    label: "Security code"
  }, {
    title: 3,
    label: "Finish"
  }]
  selectedIndex: number = 0;
  elements: any = [
    { 'domain': 'Mark', time: 'Otto', party: 'Yes' },
    { 'domain': 'Mark', time: 'Otto', party: 'Yes' },
    { 'domain': 'Mark', time: 'Otto', party: 'No' },
  ];

  headElements = ['Nr', 'Domain', 'Last accessed', '3rd party'];
  constructor(public element: ElementRef, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      code: ['', Validators.required],


    })

  }

  get f() { return this.form.controls; }


  ngAfterViewInit() {
    Promise.resolve().then(() => {
      this.collapses.forEach((collapse: CollapseComponent) => {
        collapse.toggle();
      });
    })
  }

  activate(e) {
    this.elementClicked = 'You clicked: ' + e.target;
    console.log(this.elementClicked)
    console.log(e)
  }

  setIndex(index: number) {
    this.selectedIndex = index;
    console.log(this.selectedIndex, "selectedIndex")
  }

  continue() {
    let isValid: boolean = true
    if (this.selectedIndex == 1)
      isValid = this.validateSecurityCode()
    if (isValid)
      this.selectedIndex++

    console.log(this.form)
  }


  sendCode() {

  }
  validateSecurityCode() {
    console.log("validate")
    // throw new Error('Function not implemented.');
    return true
  }

}

