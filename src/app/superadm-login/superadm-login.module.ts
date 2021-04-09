import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuperadmLoginComponent } from './superadm-login.component';
import { HrDailyWorkComponent } from './hr-dailywork/daily-work.component';
import { HrLeaveApplicationComponent } from './hr-leaveapplication/leave-application.component';
import { HrHolidaysComponent } from './hr-holidays/holidays.component';
import { HrDailyworkComponent } from './hr-dailywork/hr-dailywork.component';
import { HrHolidayComponent } from './hr-holiday/hr-holiday.component';



@NgModule({
  declarations: [SuperadmLoginComponent, HrDailyWorkComponent, HrLeaveApplicationComponent, HrHolidaysComponent, HrDailyworkComponent, HrHolidayComponent],
  imports: [
    CommonModule
  ]
})
export class SuperadmLoginModule { }
