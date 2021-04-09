import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HrHolidayComponent } from './hr-holiday.component';

describe('HrHolidayComponent', () => {
  let component: HrHolidayComponent;
  let fixture: ComponentFixture<HrHolidayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HrHolidayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HrHolidayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
