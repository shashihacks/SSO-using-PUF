import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginWithPufComponent } from './login-with-puf.component';

describe('LoginWithPufComponent', () => {
  let component: LoginWithPufComponent;
  let fixture: ComponentFixture<LoginWithPufComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginWithPufComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginWithPufComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
