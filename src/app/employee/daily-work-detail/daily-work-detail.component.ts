import { Component, OnInit,ViewChild } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { CookieService } from 'ngx-cookie-service';
import { AlertMessagesComponent } from 'src/app/common-module/alert-messages/alert-messages.component';
import { EmployeeService } from 'src/app/services/employee.service';
declare var $:any;

@Component({
  selector: 'app-daily-work-detail',
  templateUrl: './daily-work-detail.component.html',
  styleUrls: ['./daily-work-detail.component.css']
})
export class DailyWorkDetailComponent implements OnInit {

  name = 'Angular';
  myForm: FormGroup;
  arr: FormArray;
  dailyWorkAdd : boolean = false
  // constructor(private fb: FormBuilder) { }
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
  constructor(private fb: FormBuilder,private router : Router, private employeeService : EmployeeService,
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
        headerName: 'Sno',
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
        headerName: 'Module Name',
        field: 'Module Name',
        flex:1,
      },
      {
        headerName: 'Description',
        field: 'Description',
        flex:1,
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


  ngOnInit() {
    this.myForm = this.fb.group({
      arr: this.fb.array([this.createItem()])
    }),
    this.dailyWorkData();
  }

  createItem() {
    return this.fb.group({
      date:'',
      starttime: [''],
      endtime: [''],
      moduleName: [''],
      description: ['']
    })
  }


  addDailyWorkDetail(){
    this.arr = this.myForm.get('arr') as FormArray;
    this.arr.push(this.createItem());
  }


  removeDailyWorkDetail(i:number) {
    this.arr.removeAt(i);
  }

  saveDailyWorkDetail(myForm){
    console.log(this.myForm.value);
    this.isSubmit = true;
    this.dailyWork_data = myForm.value;
    if(myForm.status == "VALID"){
      this.employeeService.addUpdateDailyWorkData(this.dailyWork_data).subscribe(res => {
        console.log(res.status);

        if(res.status){
          this.dailyWorkData();
          this.isSubmit = false;
          myForm.reset();
          this.alertSuccessErrorMsg(res.status, res.message,false);
        }else{
          this.alertSuccessErrorMsg(res.status, res.message,false);
        }
      });
    }else{

    }
  }

  cancelDailyWorkDetail(){
    this.myForm.reset();
   }

   addUpdateDailyWorkData(){
  //   this.isSubmit = true;
  //   this.dailyWork_data = myForm.value;
  // if(myForm.status == "VALID"){
  //   this.employeeService.employeeLogin(this.dailyWork_data).subscribe(res => {
  //     if(res.status){
  //       this.dailyWorkData();
  //       this.isSubmit = false;
  //       myForm.reset();
  //       this.alertSuccessErrorMsg(res.status, res.message,false);
  //     }else{
  //       this.alertSuccessErrorMsg(res.status, res.message,false);
  //        }
  //      });
  //    }
    this.dailyWorkAdd = true;
   }


   dailyWorkData(){
    // let obj = {};
    // this.employeeService.getEmployeesDailyWorksheetData(obj).subscribe(res => {
    //   console.log(res.data);
    //   if(res.status){
    //     console.log(res.data);

    //     this.dailyWork_data = res.data;
    //   }else{
    //     this.alertSuccessErrorMsg(res.status, res.message,false);
    //   }

    // });
  }

  getWorkingMonthsList(){
    // let obj = {};
    // this.employeeService.getWorkingMonthsList(obj).subscribe(res => {
    //   if(res.status){
    //     this.dailyWork_data = res.data;
    //     console.log(res.data);
    //   }else{
    //     // this.alertSuccessErrorMsg(res.status, res.message,false);
    //   }
    // });
  }

   alertSuccessErrorMsg(status,message,navigationEvent){
    this.alertmessage.callAlertMsgMethod(true,message,navigationEvent);
  }
}
