import { Component, OnInit,ViewChild } from '@angular/core';
import { FormArray, FormsModule, NgForm, FormBuilder , Validators, FormControl} from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AlertMessagesComponent } from 'src/app/common-module/alert-messages/alert-messages.component';
import { SuperadminService } from 'src/app/services/superadmin.service';
declare var $:any;
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
  holidayList = [];
  monthList = [];
  daysOfWeek = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  constructor(private router : Router,private superadminService : SuperadminService,
    private cookieService : CookieService,private fb : FormBuilder) {
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
       flex:1,
       filter: "agTextColumnFilter",
       cellClass: 'ag-grid-cell-border',
       cellRenderer: (data) => {
         return data.value ? (new Date(data.value)).toLocaleDateString() : '';
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
     },
     {
       headerName: 'Created On',
       field: 'created_on',
       type: ['dateColumn'],
       flex:1,
       filter: "agTextColumnFilter",
       cellClass: 'ag-grid-cell-border',
       cellRenderer: (data) => {
         return data.value ? (new Date(data.value)).toLocaleDateString() : '';
       }
     },{
       headerName: 'Action',
       field: 'row_id',
       flex:1,
       cellClass: 'ag-grid-cell-border',
       onCellClicked: (params)=> {
         this.editHolidays(params);
       },
       cellRenderer: (params)=> {
         return '<a class="ag-grid-link"><i class="fa fa-pencil"></i></a>'
       },
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

  addUpdateHolidayForm = this.fb.group({
    row_id: 0,
    name : ['' ,Validators.required],
    date : ['' ,Validators.required]
  });

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

  openDeleteHolidayModal(){
    let selected = this.gridApi.getSelectedRows();
    if(selected && selected.length > 0){
      $("#deleteHolidayModal").modal('show');
    }else{
      this.alertSuccessErrorMsg(false, "Please select a row!!",false);
    }
  }

  deleteLeaveApplication(){
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
      $("#deleteHolidayModal").modal('hide');
      this.alertSuccessErrorMsg(false, "Please select a row!!",false);
    }
  }

  addUpdateBusinessHolidays(addUpdateHolidayForm){
    this.isSubmit = true;
    let holiday_data = addUpdateHolidayForm.value;
    if(addUpdateHolidayForm.status == "VALID"){
      this.superadminService.addUpdateBusinessHolidays(holiday_data).subscribe(res => {
        if(res.status){
          this.hrHolidayList()
          this.isSubmit = false;
          this.holiday = false;
          this.addUpdateHolidayForm.reset();
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
        this.holidayList = res.data;
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
     }else{
       this.alertSuccessErrorMsg(res.status, res.message,false);
     }
   });
  }

  editHolidays(params){
    let holiday = this.holidayList.filter(function(d){
      if(d.row_id == params.value){
        return d;
      }
    });
    this.isSubmit = false;
    this.holiday = true;
    let holiday_data = {
      row_id: holiday[0].row_id,
      name : holiday[0].name,
      date : this.convertDateToReadableString(holiday[0].date),
    };
    this.addUpdateHolidayForm.patchValue(holiday_data);
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

  alertSuccessErrorMsg(status,message,navigationEvent){
    this.alertmessage.callAlertMsgMethod(true,message,navigationEvent);
  }
}
