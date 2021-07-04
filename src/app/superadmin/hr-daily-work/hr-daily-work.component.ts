import { Component, OnInit,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { AlertMessagesComponent } from 'src/app/common-module/alert-messages/alert-messages.component';
import { SuperadminService } from 'src/app/services/superadmin.service';
import { EmployeeService } from 'src/app/services/employee.service';
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
  monthList = [];
  monthlyRadio:any = 1;
  daily_date:any;
 constructor(private router : Router,private superadminService : SuperadminService,private employeeService :  EmployeeService) {
    this.columnDefs = [
     {
       headerName: 'Sno',
       field: 'Sno',
       valueGetter: "node.rowIndex + 1",
       filter: false,
       maxWidth: 100,
       minWidth: 100,
       cellClass: 'ag-grid-cell-border'
     },
     {
       headerName: 'Employee Name',
       field: 'name',
       flex:1,
     },
     // {
     //   headerName: 'Email',
     //   field: 'email',
     //   flex:1,
     // },
     {
       headerName: 'Date',
       field: 'formatted_date',
       type: ['dateColumn', 'nonEditableColumn'],
       flex:1,
       filter: "agTextColumnFilter",
       cellClass: 'ag-grid-cell-border',
       // onCellClicked: (params)=> {
       //   this.editWorkByDate(params);
       // },
       // cellRenderer: (data) => {
       //   return data.value ? (new Date(data.value)).toLocaleDateString() : '';
       //   // return data.value ? '<a class="ag-grid-link">'+(new Date(data.value)).toLocaleDateString()+'</a>' : '';
       // }
     },
     {
       headerName: 'Module Name',
       field: 'module',
       flex:1,
     },
     {
       headerName: 'Description',
       field: 'description',
       flex:1,
     },
     {
       headerName: 'Start Time',
       field: 'formatted_start_time',
       type: 'numberColumn',
       // cellRenderer: (data) => {
       //   return data.value ? this.formatAMPM(new Date(data.value)) : '';
       // }
     },
     {
       headerName: 'End Time',
       field: 'formatted_end_time',
       type: 'numberColumn',
       // cellRenderer: (data) => {
       //   return data.value ? this.formatAMPM(new Date(data.value)) : '';
       // }
     },
     {
       headerName: 'Created On',
       field: 'created_on',
       type: 'numberColumn',
       cellRenderer: (data) => {
         return data.value ? (new Date(data.value)).toLocaleDateString() : '';
       }
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
    let date = new Date();
    let start_date = new Date(date.getFullYear(), date.getMonth(), 1); // get current month first date
    this.selectMonth = start_date;
    this.getWorkingMonthsList();
    this.dailyWorkList();
  }

  dailyWorkList(){
    let obj = {
      monthly: this.monthlyRadio ? true : false,
      daily: this.monthlyRadio ? false : true,
      date: this.monthlyRadio ? (this.selectMonth ? +this.selectMonth : "") : this.daily_date,
      offset:this.employeeService.get_Time()
    };
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
        this.monthList = res.data;
        console.log(res.data);
      }else{
        // this.alertSuccessErrorMsg(res.status, res.message,false);
      }
    });
  }

  alertSuccessErrorMsg(status,message,navigationEvent){
    this.alertmessage.callAlertMsgMethod(true,message,navigationEvent);
  }

  formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }

  selectMonthChange(selectMonth){
    this.dailyWorkList();
  }

  onItemChange(){
    this.daily_date = this.convertDateToReadableString(+new Date());
    this.dailyWorkList();
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

}
