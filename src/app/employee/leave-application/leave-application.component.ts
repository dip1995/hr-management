import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormArray, FormsModule, NgForm, FormBuilder , FormGroup, Validators, FormControl} from '@angular/forms';
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
  gridApi:any;
  gridColumnApi:any;

  columnDefs:any;
  defaultColDef:any;
  defaultColGroupDef:any;
  columnTypes:any;
  rowData: [];
  dateParts:any;
  cellDate:any;
  selectMonth:any;
  leave_data:any = {};
  leaveList:any = [];
  monthList:any = [];
  minDate:any = +new Date();
  maxDate:any = +new Date();
  constructor(
    private fb: FormBuilder,
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
        field: 'date_from',
        type: ['dateColumn'],
        width: 220,
        flex:1,
        filter: "agTextColumnFilter",
        cellClass: 'ag-grid-cell-border',
        onCellClicked: (params)=> {
          this.editLeaveApplication(params);
        },
        cellRenderer: (data) => {
          return data.value ? '<a class="ag-grid-link">'+(new Date(data.value)).toLocaleDateString()+'</a>' : '';
        }
      },
      {
        headerName: 'Date To',
        field: 'date_to',
        type: ['dateColumn'],
        // width: 220,
        flex:1,
        filter: "agTextColumnFilter",
        cellClass: 'ag-grid-cell-border',
        cellRenderer: (data) => {
          return data.value ? (new Date(data.value)).toLocaleDateString() : "";
        }
      },
      {
        headerName: 'Description',
        field: 'description',
        // width: 220,
        flex:1,
        filter: "agTextColumnFilter",
        cellClass: 'ag-grid-cell-border'

      },
      {
        headerName: 'Status',
        field: 'approve_status',
        // width: 220,
        flex:1,
        filter: "agTextColumnFilter",
        cellClass: 'ag-grid-cell-border',
        cellRenderer: (data) => {
          return data.value == 1 ? "Approved" : data.value == 2 ? "Rejected" : "Pending";
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
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  leaveForm = this.fb.group({
    row_id:0,
    date_from: ['' ,Validators.required],
    date_to: ['' ,Validators.required],
    description: ['' ,Validators.required],
  });

  ngOnInit(){
    this.getWorkingMonthsList();
    this.getLeaveApplicationList();
  }

  dateFromChanged(){
    this.maxDate = +new Date(this.leaveForm.value.date_from);
  }

  applyLeaveApplication(){
    this.approveapplication = true;
  }

  submitLeaveApplication(leaveForm){
    this.isSubmit = true;
    this.leave_data = leaveForm.value;
    if(leaveForm.status == "VALID"){
      this.employeeService.addUpdateLeaveApplication(this.leave_data).subscribe(res => {
        if(res.status){
          this.isSubmit = false;
          this.leaveForm.reset();
          this.approveapplication = false;
          this.getLeaveApplicationList();
          this.alertSuccessErrorMsg(res.status, res.message,false);
        }else{
          this.alertSuccessErrorMsg(res.status, res.message,false);
        }
      });
    }
  }

  getLeaveApplicationList(){
    let obj = {};
    this.employeeService.getLeaveApplicationListByEmployee(obj).subscribe(res => {
      if(res.status){
        this.leaveList = res.data;
        // this.alertSuccessErrorMsg(res.status, res.message,false);
      }else{
        this.alertSuccessErrorMsg(res.status, res.message,false);
      }
    });
  }

  getWorkingMonthsList(){
    let obj = {};
    this.employeeService.getWorkingMonthsList(obj).subscribe(res => {
      if(res.status){
        this.monthList = res.data;
      }else{
        // this.alertSuccessErrorMsg(res.status, res.message,false);
      }
    });
  }

  editLeaveApplication(params){
    let data = params.data;
    this.isSubmit = false;
    this.approveapplication = true;
    this.leave_data = {
      row_id:data.row_id,
      date_from: this.convertDateToReadableString(data.date_from),
      date_to: this.convertDateToReadableString(data.date_to),
      description: data.description,
    }
    this.leaveForm.patchValue(this.leave_data);
  }

  openDeleteLeaveModal(){
    let selected = this.gridApi.getSelectedRows();
    if(selected && selected.length > 0){
      $("#deleteLeaveModal").modal('show');
    }else{
      this.alertSuccessErrorMsg(false, "Please select a row!!",false);
    }
  }

  deleteLeaveApplication(){
    let selected = this.gridApi.getSelectedRows();
    if(selected && selected.length > 0){
      let obj = {
        row_id:selected[0].row_id
      };
      this.employeeService.deleteLeaveApplication(obj).subscribe(res => {
        if(res.status){
          $("#deleteLeaveModal").modal('hide');
          this.getLeaveApplicationList();
          this.alertSuccessErrorMsg(res.status, res.message,false);
        }else{
          this.alertSuccessErrorMsg(res.status, res.message,false);
        }
      });
    }else{
      $("#deleteLeaveModal").modal('hide');
      this.alertSuccessErrorMsg(false, "Please select a row!!",false);
    }
  }

  alertSuccessErrorMsg(status,message,navigationEvent){
    this.alertmessage.callAlertMsgMethod(true,message,navigationEvent);
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

  selectMonthChange(selectMonth){
    console.log('selectMonth--',selectMonth)
  }

}
