import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DailyWorkComponent } from './daily-work/daily-work.component';
import { LeaveApplicationComponent } from './leave-application/leave-application.component';
import { LogoutComponent } from './logout/logout.component';
import { AgGridModule } from 'ag-grid-angular';
import { DetailComponent } from './detail/detail.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SuperadmLoginComponent } from './superadm-login/superadm-login.component';
import { EmpLoginComponent } from './emp-login/emp-login.component';
import { HrDailyworkComponent} from './superadm-login/hr-dailywork/hr-dailywork.component';
import { HrLeaveApplicationComponent } from './superadm-login/hr-leave-application/hr-leave-application.component';
import { HrHolidayComponent } from './superadm-login/hr-holiday/hr-holiday.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DailyWorkComponent,
    LeaveApplicationComponent,
    LogoutComponent,
    DetailComponent,
    SuperadmLoginComponent,
    EmpLoginComponent,
    HrDailyworkComponent,
    HrLeaveApplicationComponent,
    HrHolidayComponent    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AgGridModule.withComponents([]),
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
