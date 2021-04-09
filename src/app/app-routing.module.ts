import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DailyWorkComponent } from './daily-work/daily-work.component';
import { DetailComponent } from './detail/detail.component';
import { EmpLoginComponent } from './emp-login/emp-login.component';
import { HomeComponent } from './home/home.component';
import { LeaveApplicationComponent } from './leave-application/leave-application.component';
import { LogoutComponent } from './logout/logout.component';
import { HrDailyworkComponent } from './superadm-login/hr-dailywork/hr-dailywork.component';
import { SuperadmLoginComponent } from './superadm-login/superadm-login.component';
import { HrLeaveApplicationComponent} from './superadm-login/hr-leave-application/hr-leave-application.component';
import { HrHolidayComponent} from './superadm-login/hr-holiday/hr-holiday.component';

const routes: Routes = [
  // {path:'',component:SuperadmLoginComponent},
  {path:'superadmin', component:SuperadmLoginComponent,
  children:[
    {path:'dlywork',component:HrDailyworkComponent,pathMatch:'full'},
    {path:'leaveapplication',component:HrLeaveApplicationComponent,pathMatch:'full'},
    {path:'holiday',component:HrHolidayComponent,pathMatch:'full'}
  ]},
  // {path:'dlywork',component:HrDailyworkComponent},
  // {path:'holiday',component:HrHolidayComponent},
  // //  {path:'superadmin/holiday',component:HrHolidayComponent},
  {path:'',component:HomeComponent},
  {path:'employeelogin',component:EmpLoginComponent},
  {path:'dailywork',component:DailyWorkComponent},
  {path:'leave',component: LeaveApplicationComponent},
  {path:'logout',component: LogoutComponent},
  {path:'detail',component:DetailComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
