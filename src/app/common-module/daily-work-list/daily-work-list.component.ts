import { Component, OnInit,ViewChild,Input,EventEmitter, Output } from '@angular/core';
import { FormArray, FormsModule, NgForm, FormBuilder , FormGroup, Validators, FormControl} from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AlertMessagesComponent } from 'src/app/common-module/alert-messages/alert-messages.component';
import { EmployeeService } from 'src/app/services/employee.service';
import { SuperadminService } from 'src/app/services/superadmin.service';
declare var $:any;
import * as _ from 'lodash';

@Component({
  selector: 'app-daily-work-list',
  templateUrl: './daily-work-list.component.html',
  styleUrls: ['./daily-work-list.component.css']
})
export class DailyWorkListComponent implements OnInit {
  @ViewChild(AlertMessagesComponent,{static:false}) alertmessage: AlertMessagesComponent;
  @Output() editWork: EventEmitter<any> = new EventEmitter();
  @Output() deleteWork: EventEmitter<any> = new EventEmitter();
  userCookie:any = {};
  dailyWork_data:any = [];
  grouped_dailyWork:any = {};
  sorted_dates:any = [];
  from_date:any;
  to_date:any;
  maxDate:any = +new Date();
  reportData:any;
  currentRow:any;
  @Input('user_type') user_type:any ;
  @Input('userid') userid:any ;
  constructor(
    private fb: FormBuilder,
    private router : Router,
    private employeeService : EmployeeService,
    private cookieService : CookieService,
    private superadminService : SuperadminService
  ) {
    this.userCookie = (this.cookieService.get('epuser')) ? JSON.parse(this.cookieService.get('epuser')) : {} ;
  }

  ngOnInit(): void {
    let date = new Date();
    let start_date = new Date(date.getFullYear(), date.getMonth(), 1); // get current month first date
    if(this.user_type == 'employee'){
      this.userid = this.userCookie.userid;
    }
    // else{
    //   start_date = new Date(+new Date() - (5*24*60*60*1000)); // 5 day before date
    // }
    this.from_date = this.convertDateToReadableString(start_date);
    this.to_date = this.convertDateToReadableString(date);
    this.dailyWorkData();
  }

  dailyWorkData(){
    this.sorted_dates = [];
    let obj = {
      id: this.userid,
      from_date: this.from_date ? +new Date(this.from_date) : 0,
      to_date: this.to_date ? +new Date(this.to_date) : 0,
      offset: this.employeeService.get_Time(),
      user_type: this.user_type,
    };
    this.employeeService.getEmployeesDailyWorksheetData(obj).subscribe(res => {
      if(res.status){
        this.dailyWork_data = res.data.result;
        this.grouped_dailyWork = res.data.grouped_data;
        this.reportData = res.data.working_details;
        this.reportData.total_leaves = this.reportData.total_leaves ? this.reportData.total_leaves : 0;
        this.reportData.total_working_days = this.reportData.total_working_days ? this.reportData.total_working_days : 0;
        this.reportData.total_days = this.reportData.total_days ? this.reportData.total_days : 0;
        this.reportData.absent = this.reportData.absent ? this.reportData.absent : 0;
        this.reportData.present = this.reportData.present ? this.reportData.present : 0;
        if(this.grouped_dailyWork && Object.keys(this.grouped_dailyWork).length > 0){
          let sorted = _.sortBy(Object.keys(this.grouped_dailyWork));
          this.sorted_dates = sorted.reverse();
        }
      }else{
        this.alertSuccessErrorMsg(res.status, res.message,false);
      }
    });
  }

  fromAndToDateChange(date,from_date_changes){
    if(from_date_changes){
      this.maxDate = +new Date(this.from_date);
      let old_date = +new Date(this.to_date);
      if(this.maxDate > old_date){
        this.to_date = this.from_date;
      }
    }
  }

  convertDateToReadableString(date){
    let readable_date = "";
    if(date){
      let newdate = new Date(date);
      let day = newdate.getDate() > 9 ? newdate.getDate() : "0"+newdate.getDate();
      let month = newdate.getMonth() > 8 ? (newdate.getMonth() + 1) : "0"+(newdate.getMonth() + 1);
      let year = newdate.getFullYear();
      return year+"-"+month+"-"+day;//"2021-04-17"
    }
    return readable_date;
  }

  editDailyWorkData(single_work){
    this.editWork.emit({value:single_work.date});
  }

  deletWorkProcess(row){
    this.deleteWork.emit([row]);
  }

  openPresentModal(row){
    this.currentRow = row;
    $("#addPresentModal").modal('show');
  }

  makePresentProcess(){
    if(this.currentRow){
      let obj = {
        date: this.currentRow.ea_date ? this.currentRow.ea_date : this.currentRow.date,
        id: this.currentRow.userid,
        attendance_id: this.currentRow.ea_id
      };
      this.superadminService.addPresentByUser(obj).subscribe(res => {
        if(res.status){
          $("#addPresentModal").modal('hide');
          this.currentRow = false;
          this.alertSuccessErrorMsg(res.status, res.message,false);
          this.dailyWorkData();
        }else{
          this.alertSuccessErrorMsg(res.status, res.message,false);
        }
      });
    }
  }

  alertSuccessErrorMsg(status,message,navigationEvent){
    this.alertmessage.callAlertMsgMethod(true,message,navigationEvent);
  }
}
