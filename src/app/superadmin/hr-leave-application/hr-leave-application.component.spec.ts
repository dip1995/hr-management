import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HrLeaveApplicationComponent } from './hr-leave-application.component';

describe('HrLeaveApplicationComponent', () => {
  let component: HrLeaveApplicationComponent;
  let fixture: ComponentFixture<HrLeaveApplicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HrLeaveApplicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HrLeaveApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
