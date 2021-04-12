import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  // {path:'',component:SuperadmLoginComponent},
  // {path:'superadmin', component:SuperadmLoginComponent,
  // children:[
  //   {path:'dlywork',component:HrDailyworkComponent,pathMatch:'full'},
  //   {path:'leaveapplication',component:HrLeaveApplicationComponent,pathMatch:'full'},
  //   {path:'holiday',component:HrHolidayComponent,pathMatch:'full'}
  // ]},
  // {path:'dlywork',component:HrDailyworkComponent},
  // {path:'holiday',component:HrHolidayComponent},
  // //  {path:'superadmin/holiday',component:HrHolidayComponent},
  // {path:'',component:EmpLoginComponent},
  // {path:'employeelogin',component:EmpLoginComponent},
  // {path:'dailywork',component:DailyWorkComponent},
  // {path:'leave',component: LeaveApplicationComponent},
  // {path:'logout',component: LogoutComponent},
  // {path:'detail',component:DetailComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
