import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HrDailyWorkComponent } from './hr-daily-work/hr-daily-work.component';
import { HrLeaveApplicationComponent } from './hr-leave-application/hr-leave-application.component';
import { HrHolidaysComponent } from './hr-holidays/hr-holidays.component';
import { HrEmployeeDetailsComponent } from './hr-employee-details/hr-employee-details.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { HrAuthGuard } from '../common-module/hr-auth.guard';
import { HrEmployeeComponent } from './hr-employee/hr-employee.component';
import { HrChangePasswordComponent } from './hr-change-password/hr-change-password.component';

const routes: Routes = [
    {
        path: 'superadmin',
        redirectTo: 'superadmin/login',
        pathMatch: 'full'
    },
    {
        path: 'superadmin/login',
        component: LoginComponent,
        // canActivate: [HrAuthGuard]
    },
    {
      path : 'superadmin/hr-dashboard',
      component: DashboardComponent,
      canActivate: [HrAuthGuard]
    },
    {
      path : 'superadmin/hr-employee',
      component: HrEmployeeComponent,
      canActivate: [HrAuthGuard]
    },
    {
      path: 'superadmin/employee-details/:userid',
      component: HrEmployeeDetailsComponent ,
      canActivate: [HrAuthGuard]
    },
    {
      path : 'superadmin/hr-daily-work',
      component: HrDailyWorkComponent,
      canActivate: [HrAuthGuard]
    },
    {
      path : 'superadmin/hr-leave-application',
      component: HrLeaveApplicationComponent,
      canActivate: [HrAuthGuard]
    },
    {
      path : 'superadmin/hr-holidays',
      component: HrHolidaysComponent,
      canActivate: [HrAuthGuard]
    },
    {
      path : 'superadmin/hr-change-password',
      component: HrChangePasswordComponent,
      canActivate: [HrAuthGuard]
    },
];

@NgModule({
  imports: [RouterModule,RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [HrAuthGuard]
})
export class SuperadminRoutingModule { }
