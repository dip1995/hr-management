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
  shortname:any = "";
  constructor(
    private router: Router,
    private cookieService : CookieService,
    private employeeService : EmployeeService
  ) {
    this.userCookie = this.cookieService.get('epuser') ? JSON.parse(this.cookieService.get('epuser')) : {};
  }

  ngOnInit(): void {
    let name = this.userCookie.name ? this.userCookie.name.split(" ") : [];
    let first_name = name.length > 0 && name[0] ? name[0] : "";
    let last_name = name.length > 0 && name[1] ? name[1] : "";
    this.shortname = this.firstLetter(first_name,last_name);
  }

  logoutEmployee() {
    this.employeeService.employeeLogout({}).subscribe(res=> {
      this.cookieService.delete('epuser',  ' / ' ,  'localhost');
      this.cookieService.delete('epuser');
      this.router.navigate(['/login']);
        // this.userinfoService.clearTimer(obj).subscribe(res=> {
        // });
    });
  }

  changePassword(){
    this.router.navigate(['change-password']);
  }

  firstLetter(fst, lst) {
    if (fst) {
      if (lst) {
          return fst.substr(0, 1).toUpperCase() + lst.substr(0, 1).toUpperCase(); // abc -> A
      }else
      return fst.substr(0, 1).toUpperCase();
    }
  }
}
