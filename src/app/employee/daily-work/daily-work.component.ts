import { Component, OnInit,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { CookieService } from 'ngx-cookie-service';
import { AlertMessagesComponent } from 'src/app/common-module/alert-messages/alert-messages.component';
import { EmployeeService } from 'src/app/services/employee.service';
declare var $:any;

@Component({
  selector: 'app-daily-work',
  templateUrl: './daily-work.component.html',
  styleUrls: ['./daily-work.component.css']
})
export class DailyWorkComponent implements OnInit {

  isSubmit:any=false;
  daily_work_Error:any = false;
  daily_work_ErrorMessage:any = "";
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
   day;
   month;
   year;
   cellDate;
   dailyWork_data = [];
  constructor(private router : Router, private employeeService : EmployeeService,
    private cookieService : CookieService) {
    this.columnDefs = [
      {
        headerName: 'Sno',
        field: 'Sno',
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
  this.dailyWorkData();
  }

  addUpdateDailyWorkData(myForm){
    this.isSubmit = true;
      this.dailyWork_data = myForm.value;
    if(myForm.status == "VALID"){
      this.employeeService.employeeLogin(this.dailyWork_data).subscribe(res => {
        if(res.status){
          this.dailyWorkData();
          this.isSubmit = false;
          myForm.reset();
          this.alertSuccessErrorMsg(res.status, res.message,false);
        }else{
          this.alertSuccessErrorMsg(res.status, res.message,false);
        }
      });
    }
   this.router.navigate(['daily-work-detail']);
  }

  dailyWorkData(){
    let obj = {};
    this.employeeService.getEmployeesDailyWorksheetData(obj).subscribe(res => {
      console.log(res.data);
      if(res.status){
        console.log(res.data);  

        this.dailyWork_data = res.data;
      }else{
        this.alertSuccessErrorMsg(res.status, res.message,false);
      }

    });
  }

  alertSuccessErrorMsg(status,message,navigationEvent){
    this.alertmessage.callAlertMsgMethod(true,message,navigationEvent);
  }

}
