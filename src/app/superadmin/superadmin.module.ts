import { NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CommonModuleModule } from '../common-module/common-module.module';
import { SuperadminRoutingModule } from './superadmin-routing.module';
import { HrDailyWorkComponent } from './hr-daily-work/hr-daily-work.component';
import { HrLeaveApplicationComponent } from './hr-leave-application/hr-leave-application.component';
import { HrHolidaysComponent } from './hr-holidays/hr-holidays.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { HrHeaderComponent } from './hr-header/hr-header.component';
import { AgGridModule } from 'ag-grid-angular';
import { HrEmployeeComponent } from './hr-employee/hr-employee.component';
import { HrChangePasswordComponent } from './hr-change-password/hr-change-password.component';
import { HrEmployeeDetailsComponent } from './hr-employee-details/hr-employee-details.component';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
// import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    LoginComponent,
    DashboardComponent,
    HrDailyWorkComponent,
    HrLeaveApplicationComponent,
    HrHolidaysComponent,
    HrHeaderComponent,
    HrEmployeeComponent,
    HrChangePasswordComponent,
    HrEmployeeDetailsComponent,
  ],
  imports: [
    // BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    CommonModuleModule,
    SuperadminRoutingModule,
    MatBadgeModule,
    MatIconModule,
    AgGridModule.withComponents([]),
    // HttpClientModule
  ],
  exports: [
    LoginComponent,
    DashboardComponent,
    HrDailyWorkComponent,
    HrLeaveApplicationComponent,
    HrHolidaysComponent,
    HrEmployeeDetailsComponent,
  ],
})
export class SuperadminModule {}
