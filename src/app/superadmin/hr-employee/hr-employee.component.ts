import { Component, OnInit,ViewChild} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { CookieService } from 'ngx-cookie-service';
import { AlertMessagesComponent } from 'src/app/common-module/alert-messages/alert-messages.component';
import { SuperadminService } from 'src/app/services/superadmin.service';
import { RequestOptions, Headers, Http } from '@angular/http';

@Component({
  selector: 'app-hr-employee',
  templateUrl: './hr-employee.component.html',
  styleUrls: ['./hr-employee.component.css']
})
export class HrEmployeeComponent implements OnInit {
  @ViewChild(AlertMessagesComponent,{static:false}) alertmessage: AlertMessagesComponent;
  isSubmit:any=false;
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
  constructor(private router : Router,private superadminService : SuperadminService,
    private cookieService : CookieService) {
    this.columnDefs = [
      {
        headerName: 'Name',
        field: 'Name',
      },
      {
        headerName: 'Mobile',
        field: 'Mobile',
        type: 'numberColumn',
      },
      {
        headerName: 'Email',
        field: 'Email',
        
      },
      {
        headerName: 'Salary',
        field: 'Salary',
        type: 'numberColumn',
      },
      {
        headerName: 'Leave Credit',
        field: 'Leave Credit',
        type: 'numberColumn',
      },
      {
        headerName: 'Joining Date',
        field: 'Joining Date',
        type: ['dateColumn', 'nonEditableColumn'],
        width: 220,
      },
      {
        headerName: 'Increment Date',
        field: 'Increment Date',
        type: ['dateColumn', 'nonEditableColumn'],
        width: 220,
      },
      {
        headerName: 'Document Upload',
        field: 'Document Upload',
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
    if(this.cookieService.get('superadmin')){
      console.warn(this.cookieService.get('superadmin'),this.cookieService.get('superadmin'))
      // this.router.navigate(['/superadmin/hr-employee']);
      this.hrEmployeeList();
    }
  }

  addEmployee(){
    this.addUpdateEmployee = true;
  }

  //  uploadFileToServer(event) {
  //   let fileList: FileList = event.target.files;
  //   if (fileList.length > 0) {
  //     let file: File = fileList[0];
  //     let formData: FormData = new FormData();
  //     formData.append('uploadFile', file, file.name);
  //     formData.append('fileType', 'zip');
  //     let headers = new Headers();
  //     headers.append('Accept', 'application/json');
  //     let options = new RequestOptions({ headers: headers });
  //     this.superadminService.uploadZipDocument(options).subscribe(res => {
  //       console.log(res);
        
  //     })
  //   }
  // } 

  addUpdateEmployeeDetails(f:NgForm){
    this.isSubmit = true;
    this.employee_data = f;
    if(f.status == "VALID"){
      this.superadminService.addUpdateEmployeeDetails(this.employee_data).subscribe(res => {
       console.log(res);
       
        if(res.status){
          this.isSubmit = false;
          f.reset();
          this.alertSuccessErrorMsg(res.status, res.message,false);
        }else{
          this.alertSuccessErrorMsg(res.status, res.message,false);
        }
      });
    }
  }

  // onSave(empId:number,name:string,mobile:number,email:string,salary:number,start_date:number,increament_date:number,leave_credit:number,Document:string){
  //   this.superadminService.addUpdateEmployeeDetails(empId).subscribe(res => {
  //       name =  res.name;
  //       mobile =  res.mobile
  //       email = res.email;
  //       salary = res.salary;
  //       start_date = res.start_date;
  //       increament_date = res.increament_date;
  //       leave_credit = res.leave_credit;
  //       document = res.document;
  //     })
  // }
  

  onDelete(){
  }


  hrEmployeeList(){
    
     this.employee_data = {};
      this.superadminService.getEmployeeList(this.employee_data).subscribe(res => {
        if(res.status){
          console.log(res.data);
          
        }else{
          this.alertSuccessErrorMsg(res.status, res.message,false);
        }
      });
    }
  

    alertSuccessErrorMsg(status,message,navigationEvent){
      this.alertmessage.callAlertMsgMethod(true,message,navigationEvent);
    }
  

  }

  
 