import { Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { CollapseComponent } from 'angular-bootstrap-md';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss']
})
export class SecurityComponent implements OnInit {
  @ViewChildren(CollapseComponent) collapses: CollapseComponent[];
  elementClicked: string;
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
  constructor(public element: ElementRef) { }

  ngOnInit(): void {
    console.log(this.selectedIndex, "i");

  }
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
}
