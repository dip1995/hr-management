import { TestBed } from '@angular/core/testing';

import { HrAuthGuard } from './hr-auth.guard';

describe('HrAuthGuard', () => {
  let guard: HrAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(HrAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
