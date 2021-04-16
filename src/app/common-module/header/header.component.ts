import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import {Router} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { EmployeeService } from 'src/app/services/employee.service';

// declare var $:any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  linkUrl:any = environment.LINK_URL; // url
  userCookie:any;

  constructor(
    private router: Router,
    private cookieService : CookieService,
    private employeeService : EmployeeService
  ) {
    this.userCookie = this.cookieService.get('user') ? JSON.parse(this.cookieService.get('user')) : {};
  }

  ngOnInit(): void {

  }

  logoutEmployee() {
    this.employeeService.employeeLogout({}).subscribe(res=> {
      this.cookieService.delete('user',  ' / ' ,  'localhost');
      this.cookieService.delete('user');
      this.router.navigate(['/login']);
        // this.userinfoService.clearTimer(obj).subscribe(res=> {
        // });
    });
  }

  changePassword(){
    this.router.navigate(['change-password']);
  }
}
