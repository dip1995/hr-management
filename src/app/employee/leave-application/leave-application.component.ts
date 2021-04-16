import { Component, OnInit,ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { CookieService } from 'ngx-cookie-service';
import { AlertMessagesComponent } from 'src/app/common-module/alert-messages/alert-messages.component';
import { EmployeeService } from 'src/app/services/employee.service';
declare var $:any;

@Component({
  selector: 'app-leave-application',
  templateUrl: './leave-application.component.html',
  styleUrls: ['./leave-application.component.css']
})
export class LeaveApplicationComponent implements OnInit {
  
  isSubmit:any=false;
  leaveError:any = false;
  leaveErrorMessage:any = "";
  @ViewChild(AlertMessagesComponent,{static:false}) alertmessage: AlertMessagesComponent;

  
  approveapplication:boolean = false;
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
  selectMonth;
  leave_data = [];
  constructor(    
    private employeeService : EmployeeService,
    private cookieService : CookieService,
    ) {
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
        headerName: 'Date From',
        field: 'date',
        type: ['dateColumn'],
        width: 220,
        flex:1,
        filter: "agTextColumnFilter",
        cellClass: 'ag-grid-cell-border'
 
      },
      {
        headerName: 'Date To',
        field: 'date',
        type: ['dateColumn'],
        width: 220,
        flex:1,
        filter: "agTextColumnFilter",
        cellClass: 'ag-grid-cell-border'
 
      },
      {
        headerName: 'Description',
        field: 'Description',
        width: 220,
        flex:1,
        filter: "agTextColumnFilter",
        cellClass: 'ag-grid-cell-border'
 
      },
    //   {
    //    headerName: 'Total Leave',
    //    field: 'Total Leave',
    //    type: 'numberType',
    //  },
 
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
 
  ngOnInit(){
    this.getWorkingMonthsList();
  }

  applyLeaveApplication(){
  this.approveapplication = true;
  }

  submitLeaveApplication(f){
    this.isSubmit = true;
     this.leave_data = f.value;
    if(f.status == "VALID"){
      this.employeeService.addUpdateLeaveApplication(this.leave_data).subscribe(res => {
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

  getWorkingMonthsList(){
    let obj = {};
    this.employeeService.getWorkingMonthsList(obj).subscribe(res => {
      if(res.status){
        this.leave_data = res.data;
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
