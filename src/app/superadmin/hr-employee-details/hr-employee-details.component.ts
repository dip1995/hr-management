import { Component, OnInit,ViewChild} from '@angular/core';
import { FormArray, FormsModule, NgForm, FormBuilder , Validators, FormControl} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AlertMessagesComponent } from 'src/app/common-module/alert-messages/alert-messages.component';
import { SuperadminService } from 'src/app/services/superadmin.service';
declare var $:any;

@Component({
  selector: 'app-hr-employee-details',
  templateUrl: './hr-employee-details.component.html',
  styleUrls: ['./hr-employee-details.component.css']
})
export class HrEmployeeDetailsComponent implements OnInit {
  @ViewChild(AlertMessagesComponent,{static:false}) alertmessage: AlertMessagesComponent;
  userCookie:any;
  userid:any;
  constructor(private router : Router,private superadminService : SuperadminService,
    private cookieService : CookieService,private fb : FormBuilder,private activatedRoute: ActivatedRoute) {
      this.userid = this.activatedRoute.snapshot.paramMap.get('userid');
    }

  ngOnInit(): void {
    this.userCookie = (this.cookieService.get('epsuperadmin')) ? JSON.parse(this.cookieService.get('epsuperadmin')) : {} ;
  }

}
