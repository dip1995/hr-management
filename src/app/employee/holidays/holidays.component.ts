import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AlertMessagesComponent } from 'src/app/common-module/alert-messages/alert-messages.component';
import { EmployeeService } from 'src/app/services/employee.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-holidays',
  templateUrl: './holidays.component.html',
  styleUrls: ['./holidays.component.css']
})
export class HolidaysComponent implements OnInit {
  data;
  holiday = false;
  selectYear:any;
  @ViewChild(AlertMessagesComponent,{static:false}) alertmessage: AlertMessagesComponent;
  gridApi;
  gridColumnApi;
  columnDefs;
  defaultColDef;
  defaultColGroupDef;
  columnTypes;
  rowData: [];
  dateParts;
  cellDate;
  holidayList:any = [];
  monthList:any = [];
  allYears:any=[];
  currentyear:any;
  daysOfWeek = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  constructor(private router : Router,
    private employeeService : EmployeeService,
    private cookieService : CookieService
  ) {
   this.columnDefs = [
   {
     headerName: 'Sr No',
     field: 'Sno',
     valueGetter: "node.rowIndex + 1",
     filter: false,
     maxWidth: 100,
     minWidth: 100,
     cellClass: 'ag-grid-cell-border'
   },
   {
     headerName: 'Date',
     field: 'date',
     type: ['dateColumn'],
     width: 220,
     flex:1,
     filter: "agTextColumnFilter",
     cellClass: 'ag-grid-cell-border',
     cellRenderer: (data) => {
       return data.value ? (new Date(data.value)).toLocaleDateString() : "";
     }
   },
   {
     headerName: 'Day',
     flex:1,
     field: 'day',
     cellRenderer: (data) => {
       return this.daysOfWeek[data.value - 1];
     }
   },
   {
     headerName: 'Holiday/Events',
     field: 'name',
     flex:1,
   }
 ]

    this.defaultColDef = {
     width: 150,
     editable: true,
     filter: 'agTextColumnFilter',
     floatingFilter: true,
     resizable: true,
   };

  }

  onGridReady(params) {
   this.gridApi = params.api;
   this.gridColumnApi = params.columnApi;
  }


  ngOnInit(): void {
    this.getWorkingMonthsList();
    this.getHolidayList();
  }

  getHolidayList(){
    let holiday_data = {
      year:this.selectYear ? this.selectYear : 0,
      offset: this.employeeService.get_Time()
    };
    this.employeeService.getBusinessHolidayList(holiday_data).subscribe(res => {
      if(res.status){
        this.holidayList = res.data;
      }else{
        this.alertSuccessErrorMsg(res.status, res.message,false);
      }
    });
  }

  getWorkingMonthsList(){
   let obj = {};
   this.allYears = [];
   this.employeeService.getWorkingMonthsList(obj).subscribe(res => {
     if(res.status){
       let todaydate = new Date();
       this.currentyear = todaydate.getFullYear();
       this.monthList = res.data;
       let years = _.uniq(_.map(this.monthList, 'year'));
       years.forEach((d) => {
         let find = _.find(this.monthList,{year:d});
         if(find){
           this.allYears.push(find);
         }
       });
     }else{
       this.alertSuccessErrorMsg(res.status, res.message,false);
     }
   });
  }

  selectYearChange(selectYear){
    this.getHolidayList();
  }

  alertSuccessErrorMsg(status,message,navigationEvent){
    this.alertmessage.callAlertMsgMethod(true,message,navigationEvent);
  }

}
