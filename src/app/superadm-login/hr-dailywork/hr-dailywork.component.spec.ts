import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HrDailyworkComponent } from './hr-dailywork.component';

describe('HrDailyworkComponent', () => {
  let component: HrDailyworkComponent;
  let fixture: ComponentFixture<HrDailyworkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HrDailyworkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HrDailyworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
