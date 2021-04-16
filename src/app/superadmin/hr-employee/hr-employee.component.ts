import { Component, OnInit,ViewChild} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { CookieService } from 'ngx-cookie-service';
import { AlertMessagesComponent } from 'src/app/common-module/alert-messages/alert-messages.component';
import { SuperadminService } from 'src/app/services/superadmin.service';
import { RequestOptions, Headers, Http } from '@angular/http';
declare var $:any;

@Component({
  selector: 'app-hr-employee',
  templateUrl: './hr-employee.component.html',
  styleUrls: ['./hr-employee.component.css']
})
export class HrEmployeeComponent implements OnInit {
  @ViewChild(AlertMessagesComponent,{static:false}) alertmessage: AlertMessagesComponent;
  isSubmit:any=false;
  file:any;
  fileName:any = "";
  employeeError:any = false;
  employeeErrorMessage:any = "";
  addUpdateEmployee:boolean = false;

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
   employee_data;
   employee_data1 = [];
  constructor(private router : Router,private superadminService : SuperadminService,
    private cookieService : CookieService) {
    this.columnDefs = [
      {
        headerName: 'Name',
        field: 'name',
      },
      {
        headerName: 'Mobile',
        field: 'mobile',
        type: 'numberColumn',
      },
      {
        headerName: 'Email',
        field: 'email',

      },
      {
        headerName: 'Salary',
        field: 'salary',
        type: 'numberColumn',
      },
      {
        headerName: 'Joining Date',
        field: 'start_date',
        type: ['dateColumn', 'nonEditableColumn'],
        width: 220,
      },
      {
        headerName: 'Increment Date',
        field: 'increament_date',
        type: ['dateColumn', 'nonEditableColumn'],
        width: 220,
      },
      {
        headerName: 'Leave Credit',
        field: 'leave_credit',
        type: 'numberColumn',
      },
      {
        headerName: 'Document Upload',
        field: 'file',
        // type: 'file',
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
    this.hrEmployeeList();
  }

  openEndSessionModal(){
    $("#endSessionModal").modal('show');
  }

  addEmployee(){
    this.addUpdateEmployee = true;
  }

  addUpdateEmployeeDetails(f:NgForm){
    this.isSubmit = true;
    this.employee_data = f.value;
     console.log(this.employee_data);
    if(f.status == "VALID"){
      this.employee_data.document = this.fileName;
      this.superadminService.addUpdateEmployeeDetails(this.employee_data).subscribe(res => {
        console.log(res);

        if(res.status){
          this.hrEmployeeList();
          this.isSubmit = false;
          this.addUpdateEmployee = false;
          f.reset();
          this.alertSuccessErrorMsg(res.status, res.message,false);
        }else{
          this.alertSuccessErrorMsg(res.status, res.message,false);
        }
      });
    }
  }

  uploadFile(event){
    if(event.target.files && event.target.files.length > 0){
      this.fileName = event.target.files[0].name;
      this.file = event.target.files[0];
      let formdata = new FormData();
      formdata.append("file", this.file);
      this.superadminService.uploadZipDocument(formdata).subscribe(res => {
        if(res.status){
          this.fileName = res.data.filename;
          console.log(this.fileName);

        }else{
          this.alertSuccessErrorMsg(res.status, res.message,false);
        }
      });
    }else{
      this.fileName = "";
      this.file = {};
    }
  }



  hrEmployeeList(){
    let obj = {};
    this.superadminService.getEmployeeList(obj).subscribe(res => {
      console.log(res.data);

      if(res.status){
        console.log(res.data);

        this.employee_data1 = res.data;
      }else{
        this.alertSuccessErrorMsg(res.status, res.message,false);
      }
    });
  }

  endEmployeeSession(){

  }

  deleteEmployee(){

  }

  alertSuccessErrorMsg(status,message,navigationEvent){
    this.alertmessage.callAlertMsgMethod(true,message,navigationEvent);
  }

}
