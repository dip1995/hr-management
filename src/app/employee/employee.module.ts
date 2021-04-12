import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CommonModuleModule } from '../common-module/common-module.module';

import { EmployeeRoutingModule } from './employee-routing.module';
import { DailyWorkComponent } from './daily-work/daily-work.component';
import { LeaveApplicationComponent } from './leave-application/leave-application.component';
import { HolidaysComponent } from './holidays/holidays.component';
import { EmployeeLoginComponent } from './employee-login/employee-login.component';
import { DailyWorkDetailComponent } from './daily-work-detail/daily-work-detail.component';
import { AgGridModule } from 'ag-grid-angular';

@NgModule({
  declarations: [DailyWorkComponent, LeaveApplicationComponent, HolidaysComponent, EmployeeLoginComponent, DailyWorkDetailComponent],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    CommonModuleModule,
    EmployeeRoutingModule,
    AgGridModule.withComponents([])



  ],
  exports: [
    DailyWorkComponent,
    LeaveApplicationComponent,
    HolidaysComponent,
    EmployeeLoginComponent
  ]
})
export class EmployeeModule { }
