import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import {Router} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { SuperadminService } from 'src/app/services/superadmin.service';

@Component({
  selector: 'app-hr-header',
  templateUrl: './hr-header.component.html',
  styleUrls: ['./hr-header.component.css']
})
export class HrHeaderComponent implements OnInit {

  linkUrl:any = environment.LINK_URL; // url
  userCookie:any;
  employeeReport:any = {};
  constructor(
    private router: Router,
    private cookieService : CookieService,
    private superadminService : SuperadminService,
  ) {
    this.userCookie = this.cookieService.get('superadmin') ? JSON.parse(this.cookieService.get('superadmin')) : {};
  }

  ngOnInit(): void {
    this.getAllEmployeeReportCard();
  }

  logoutHR() {
    this.superadminService.superadminLogout({}).subscribe(res=> {
      this.cookieService.delete('epsuperadmin',  ' / ' ,  'localhost');
      this.cookieService.delete('epsuperadmin');
      this.router.navigate(['/superadmin/login']);
        // this.userinfoService.clearTimer(obj).subscribe(res=> {
        // });
    });
  }

  getAllEmployeeReportCard() {
    this.superadminService.getAllEmployeeReportCard({}).subscribe(res=> {
      if(res.data && res.data.length > 0){
        this.employeeReport = res.data[0];
        this.employeeReport.total_leave = this.employeeReport.total_leave ? this.employeeReport.total_leave : 0;
        this.employeeReport.pending = this.employeeReport.pending ? this.employeeReport.pending : 0;
        this.employeeReport.rejected = this.employeeReport.rejected ? this.employeeReport.rejected : 0;
        this.employeeReport.approved = this.employeeReport.approved ? this.employeeReport.approved : 0;
      }
    });
  }

  changePasswordHR(){
   this.router.navigate(['superadmin/hr-change-password']);
  }
}
