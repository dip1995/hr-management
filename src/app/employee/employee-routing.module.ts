import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DailyWorkComponent } from './daily-work/daily-work.component';
import { LeaveApplicationComponent } from './leave-application/leave-application.component';
import { HolidaysComponent } from './holidays/holidays.component';
import { EmployeeLoginComponent } from './employee-login/employee-login.component';
import { AuthGuard } from '../common-module/auth.guard';

const routes: Routes = [
    {
        path: '',
        redirectTo: '/login',
        // component: LoginComponent,
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: EmployeeLoginComponent,
    },
    {
      path : 'daily-work',
      component: DailyWorkComponent,
      canActivate: [AuthGuard]
    },
    {
      path : 'leave-application',
      component: LeaveApplicationComponent,
      canActivate: [AuthGuard]
    },
    {
      path : 'holidays',
      component: HolidaysComponent,
      canActivate: [AuthGuard]
    },
];

@NgModule({
  imports: [RouterModule,RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class EmployeeRoutingModule { }
