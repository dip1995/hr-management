import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyWorkListComponent } from './daily-work-list.component';

describe('DailyWorkListComponent', () => {
  let component: DailyWorkListComponent;
  let fixture: ComponentFixture<DailyWorkListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyWorkListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyWorkListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
