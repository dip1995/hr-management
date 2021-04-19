import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HrChangePasswordComponent } from './hr-change-password.component';

describe('HrChangePasswordComponent', () => {
  let component: HrChangePasswordComponent;
  let fixture: ComponentFixture<HrChangePasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HrChangePasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HrChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
