import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperadmLoginComponent } from './superadm-login.component';

describe('SuperadmLoginComponent', () => {
  let component: SuperadmLoginComponent;
  let fixture: ComponentFixture<SuperadmLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuperadmLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperadmLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
