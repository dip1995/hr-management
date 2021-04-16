import { Component, OnInit,NgModule, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormArray, FormsModule, NgForm, FormBuilder , Validators, FormControl} from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { AlertMessagesComponent } from 'src/app/common-module/alert-messages/alert-messages.component';
import { SuperadminService } from 'src/app/services/superadmin.service';
declare var $:any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  isSubmit:any=false;
  loginError:any = false;
  loginErrorMessage:any = "";
  @ViewChild(AlertMessagesComponent,{static:false}) alertmessage: AlertMessagesComponent;

  constructor(
    private router: Router,
    private fb : FormBuilder,
    private superadminService : SuperadminService,
    private cookieService : CookieService,
  ) { }

  HRLoginForm = this.fb.group({
    username : ['' ,Validators.required],
    password : ['' ,Validators.required]
  });

  ngOnInit(): void {
    if(this.cookieService.get('superadmin')){
      console.warn(this.cookieService.get('superadmin'),this.cookieService.get('superadmin1'))
      this.router.navigate(['/superadmin/hr-employee']);
    }
  }

  hrLogin(){
    this.isSubmit = true;
    let login_data = this.HRLoginForm.value;
    if(this.HRLoginForm.status == "VALID"){
      this.superadminService.superadminLogin(login_data).subscribe(res => {
        if(res.status){
          this.isSubmit = false;
          this.HRLoginForm.reset();
          let cookieData = res.data.record[0];
          cookieData.token = res.data.token;
          cookieData.login = true;
          var days_90_ms = 90*24*60*60*1000;
          var date_now = +new Date();
          var coockie_expire = new Date(date_now+days_90_ms);
          let opts = {expires:coockie_expire};
          this.cookieService.set('epsuperadmin',JSON.stringify(cookieData),opts);
          this.router.navigate(['/superadmin/hr-employee']);
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

  alertSuccessErrorMsg(status,message,navigationEvent){
    this.alertmessage.callAlertMsgMethod(true,message,navigationEvent);
  }
}
