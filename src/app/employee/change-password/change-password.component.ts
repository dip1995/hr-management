import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormArray, FormsModule, NgForm, FormBuilder , FormGroup, Validators, FormControl} from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { AlertMessagesComponent } from 'src/app/common-module/alert-messages/alert-messages.component';
import { EmployeeService } from 'src/app/services/employee.service';
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  changePassword:any = {};
  userCookie:any = {};
  isSubmit:any = false;
  changePasswordForm: FormGroup;
  @ViewChild(AlertMessagesComponent,{static:false}) alertmessage: AlertMessagesComponent;
  constructor(private router : Router,
    private fb: FormBuilder,
    private employeeService : EmployeeService,
    private cookieService : CookieService
  ) {}

  ngOnInit(): void {
    this.userCookie = (this.cookieService.get('epuser')) ? JSON.parse(this.cookieService.get('epuser')) : {} ;
    this.changePasswordForm = this.fb.group({
      current: ['' ,Validators.required],
      password: ['' ,Validators.required],
      confirm_password: ['' ,Validators.required]
    }, {
      validator: this.validatePasswords('password', 'confirm_password')
    });
  }

  saveChangePassword(changePasswordForm){
   this.isSubmit = true;
   this.changePassword = changePasswordForm.value;
   this.changePassword.id = this.userCookie.userid;
   if(changePasswordForm.status == "VALID"){
     this.employeeService.updatePassword(this.changePassword).subscribe(res => {
       if(res.status){
         this.isSubmit = false;
         this.changePasswordForm.reset();
         this.alertSuccessErrorMsg(res.status, res.message,false);
         setTimeout(function(){
           this.router.navigate(['/daily-work']);
         },3000);
       }else{
         this.alertSuccessErrorMsg(res.status, res.message,false);
       }
     });
   }
  }

  validatePasswords(controlName: string, matchingControlName: string){
    return (formGroup: FormGroup) => {
      let control = formGroup.controls[controlName];
      let matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
          // return if another validator has already found an error on the matchingControl
          return;
      }
      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
          matchingControl.setErrors({ mustMatch: true });
      } else {
          matchingControl.setErrors(null);
      }
    }
  }

  alertSuccessErrorMsg(status,message,navigationEvent){
    this.alertmessage.callAlertMsgMethod(true,message,navigationEvent);
  }
}
