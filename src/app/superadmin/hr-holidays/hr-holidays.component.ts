import { Component, OnInit,ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AlertMessagesComponent } from 'src/app/common-module/alert-messages/alert-messages.component';
import { SuperadminService } from 'src/app/services/superadmin.service';
import * as _ from 'lodash';
@Component({
  selector: 'app-hr-holidays',
  templateUrl: './hr-holidays.component.html',
  styleUrls: ['./hr-holidays.component.css']
})
export class HrHolidaysComponent implements OnInit {
  @ViewChild(AlertMessagesComponent,{static:false}) alertmessage: AlertMessagesComponent;
  isSubmit:any=false;
  hrHolidayError:any = false;
  hrHolidayErrorMessage:any = "";

  data;
  holiday = false;
  selectYear;

  gridApi;
  gridColumnApi;
  columnDefs;
  defaultColDef;
  defaultColGroupDef;
  columnTypes;
  rowData: [];
  dateParts;
  day;
  month;
  year;
  cellDate;
  holiday_data1 = [];
  constructor(private router : Router,private superadminService : SuperadminService,
    private cookieService : CookieService) {
    this.columnDefs = [
     {
        maxWidth: 50,
        minWidth: 50,
        field: 'RowSelect',
        headerName: ' ',
        checkboxSelection: true,
        filter: false,
        suppressMenu: true,
        suppressSorting: true,
        flex:1,
        cellClass: 'ag-grid-cell-border'
      },
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
       cellClass: 'ag-grid-cell-border'
     },
     {
       headerName: 'Day',
       flex:1,
       field: 'Day',
     },
     {
       headerName: 'Holiday/Events',
       field: 'name',
       flex:1,
     },
   ]

   this.defaultColDef = {
     width: 150,
     editable: true,
     filter: 'agTextColumnFilter',
     floatingFilter: true,
     resizable: true,
   };
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
    this.hrHolidayList();
  }

  addHoliday(){
     this.holiday = true;
  }

  deleteLeaveApplication(f){
    let selected = this.gridApi.getSelectedRows();
    if(selected && selected.length > 0){
      let row_ids = selected.map(function(d){ return d.row_id;});
      let obj = {
        row_ids:row_ids
      };
      this.superadminService.deleteBusinessHolidays(obj).subscribe(res => {
        if(res.status){
          this.alertSuccessErrorMsg(res.status, res.message,false);
        }else{
          this.alertSuccessErrorMsg(res.status, res.message,false);
        }
      });
    }else{
      this.alertSuccessErrorMsg(false, "Please select a row!!",false);
    }
  }

  addUpdateBusinessHolidays(f:NgForm){
    this.isSubmit = true;
    let holiday_data = f.value;
    if(f.status == "VALID"){
      this.superadminService.addUpdateBusinessHolidays(holiday_data).subscribe(res => {
        if(res.status){
          this.hrHolidayList()
          this.isSubmit = false;
          this.holiday = false;
          f.reset();
          this.alertSuccessErrorMsg(res.status, res.message,false);
        }else{
          this.alertSuccessErrorMsg(res.status, res.message,false);
        }
      });
    }
  }

  hrHolidayList(){
    let holiday_data = {};
    this.superadminService.getBusinessHolidayList(holiday_data).subscribe(res => {
      if(res.status){
        console.log(res.data);
        this.holiday_data1 = res.data;
      }else{
        this.alertSuccessErrorMsg(res.status, res.message,false);
      }
    });
  }

  getWorkingMonthsList(){
   let obj = {};
   this.superadminService.getWorkingMonthsList(obj).subscribe(res => {
     if(res.status){
       console.log(res.data);
       this.holiday_data1 = res.data;
     }else{
       this.alertSuccessErrorMsg(res.status, res.message,false);
     }
   });
  }

  alertSuccessErrorMsg(status,message,navigationEvent){
    this.alertmessage.callAlertMsgMethod(true,message,navigationEvent);
  }


}
