import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HrDailyWorkComponent } from './hr-daily-work.component';

describe('HrDailyWorkComponent', () => {
  let component: HrDailyWorkComponent;
  let fixture: ComponentFixture<HrDailyWorkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HrDailyWorkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HrDailyWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
