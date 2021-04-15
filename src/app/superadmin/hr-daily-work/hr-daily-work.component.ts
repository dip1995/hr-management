import { Component, OnInit,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { AlertMessagesComponent } from 'src/app/common-module/alert-messages/alert-messages.component';
import { SuperadminService } from 'src/app/services/superadmin.service';
// declare var $:any;
// import * as $ from "jquery";

@Component({
  selector: 'app-hr-daily-work',
  templateUrl: './hr-daily-work.component.html',
  styleUrls: ['./hr-daily-work.component.css']
})
export class HrDailyWorkComponent implements OnInit {
  @ViewChild(AlertMessagesComponent,{static:false}) alertmessage: AlertMessagesComponent;
  selectMonth;
  gridApi;
  gridColumnApi;

  columnDefs;
  defaultColDef;
  defaultColGroupDef;
  columnTypes;
  rowData: [];
  dateParts;
  rowSelection;
  day;
  month;
  year;
  cellDate;
  daily_work_data = [];

 constructor(private router : Router,private superadminService : SuperadminService) {
    this.columnDefs = [
     {
       headerName: 'Sno',
       field: 'Sno',
      //  checkboxSelection:true,
     },
     {
       headerName: 'Date',
       field: 'date',
       type: ['dateColumn', 'nonEditableColumn'],
       width: 220,
     },
     {
       headerName: 'Module Name',
       field: 'Module Name',
     },
     {
       headerName: 'Description',
       field: 'Description',
       // type: 'numberColumn',
     },

     {
       headerName: 'Start Time',
       field: 'Start Time',
       type: 'numberColumn',
     },

     {
       headerName: 'End Time',
       field: 'End Time',
       type: 'numberColumn',
     },
     {
       headerName: 'Year',
       field: 'year',
       type: 'numberColumn',
     },
  ]

  this.defaultColDef = {
    width: 150,
    editable: true,
    filter: 'agTextColumnFilter',
    floatingFilter: true,
    resizable: true,
  };

   this.rowSelection = 'multiple',

    this.defaultColGroupDef = { marryChildren: true };
   this.columnTypes = {
     numberColumn: {
       width: 130,
       filter: 'agNumberColumnFilter',
     },
     nonEditableColumn: { editable: false },
     dateColumn: {
       filter: 'agDateColumnFilter',
       filterParams: {
         comparator: function (filterLocalDateAtMidnight, cellValue) {
            this.dateParts = cellValue.split('/');
            this.day = Number(this.dateParts[0]);
            this.month = Number(this.dateParts[1]) - 1;
            this.year = Number(this.dateParts[2]);
            this.cellDate = new Date(this.year, this.month, this.day);
           if (this.cellDate < filterLocalDateAtMidnight) {
             return -1;
           } else if (this.cellDate > filterLocalDateAtMidnight) {
             return 1;
           } else {
             return 0;
           }
         },
       },
     },
   };
  }

  onGridReady(params) {
   this.gridApi = params.api;
   this.gridColumnApi = params.columnApi;
  }

  ngOnInit(): void {
    this.getWorkingMonthsList();
    this.dailyWorkList();
  }

  dailyWorkList(){
    let obj = {};
    this.superadminService.getEmployeesDailyWorksheetData(obj).subscribe(res => {
      if(res.status){
        this.daily_work_data = res.data;
        console.log(res.data);
      }else{
        this.alertSuccessErrorMsg(res.status, res.message,false);
      }
    });
  }

  getWorkingMonthsList(){
    let obj = {};
    this.superadminService.getWorkingMonthsList(obj).subscribe(res => {
      if(res.status){
        this.daily_work_data = res.data;
        console.log(res.data);
      }else{
        // this.alertSuccessErrorMsg(res.status, res.message,false);
      }
    });
  }

  alertSuccessErrorMsg(status,message,navigationEvent){
    this.alertmessage.callAlertMsgMethod(true,message,navigationEvent);
  }

}
