import { Component, OnInit,NgModule, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormArray, FormsModule, NgForm, FormBuilder , Validators, FormControl} from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { AlertMessagesComponent } from 'src/app/common-module/alert-messages/alert-messages.component';
import { EmployeeService } from 'src/app/services/employee.service';
declare var $:any;

@Component({
  selector: 'app-employee-login',
  templateUrl: './employee-login.component.html',
  styleUrls: ['./employee-login.component.css']
})
export class EmployeeLoginComponent implements OnInit {

  isSubmit:any=false;
  loginError:any = false;
  loginErrorMessage:any = "";
  @ViewChild(AlertMessagesComponent,{static:false}) alertmessage: AlertMessagesComponent;

  constructor(
    private router: Router,
    private fb : FormBuilder,
    private employeeService : EmployeeService,
    private cookieService : CookieService,
  ) { }

  EmployeeLoginForm = this.fb.group({
    username : ['' ,Validators.required],
    password : ['' ,Validators.required]
  });

  ngOnInit(): void {
    // if(this.cookieService.get('epuser')){
    //   console.warn(this.cookieService.get('epuser'));
    //   this.router.navigate(['/daily-work']);
    // }
  }

  employeeLogin(){
    this.isSubmit = true;
    let login_data = this.EmployeeLoginForm.value;
    if(this.EmployeeLoginForm.status == "VALID"){
      this.employeeService.employeeLogin(login_data).subscribe(res => {
        if(res.status){
          this.isSubmit = false;
          this.EmployeeLoginForm.reset();
          let cookieData = res.data.record[0];
          cookieData.token = res.data.token;
          cookieData.login = true;
          var days_90_ms = 90*24*60*60*1000;
          var date_now = +new Date();
          var coockie_expire = new Date(date_now+days_90_ms);
          let opts = {expires:coockie_expire};
          this.cookieService.set('epuser',JSON.stringify(cookieData),opts);
          this.router.navigate(['/daily-work']);
        }else{
          this.loginError = true;
          this.loginErrorMessage = res.message;
          setTimeout(() => {
            this.loginError = false;
          }, 5000);
          // this.alertSuccessErrorMsg(res.status, res.message,false);
        }
      });
    }
  }

}
