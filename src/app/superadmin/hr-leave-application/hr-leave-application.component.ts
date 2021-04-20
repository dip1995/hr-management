import { Component, OnInit,ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { CookieService } from 'ngx-cookie-service';
import { AlertMessagesComponent } from 'src/app/common-module/alert-messages/alert-messages.component';
import { SuperadminService } from 'src/app/services/superadmin.service';
declare var $:any;

@Component({
  selector: 'app-hr-leave-application',
  templateUrl: './hr-leave-application.component.html',
  styleUrls: ['./hr-leave-application.component.css']
})
export class HrLeaveApplicationComponent implements OnInit {
  @ViewChild(AlertMessagesComponent,{static:false}) alertmessage: AlertMessagesComponent;
  isSubmit:any=false;
  selectMonth:any;
  leaveError:any = false;
  leaveErrorMessage:any = "";

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
  monthList = [];
  modalElements:any = {title:"",body:""};
  approveStatus:any = 1;
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
       headerName: 'Date From',
       field: 'date_from',
       type: ['dateColumn'],
       width: 220,
       flex:1,
       filter: "agTextColumnFilter",
       cellClass: 'ag-grid-cell-border',
       // onCellClicked: (params)=> {
       //   this.editLeaveApplication(params);
       // },
       cellRenderer: (data) => {
         return data.value ? (new Date(data.value)).toLocaleDateString() : '';
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

  ngOnInit(){
    this.getWorkingMonthsList();
    this.getLeaveApplicationList();
  }

  approveLeaveApplication(reject:number){
    let selected = this.gridApi.getSelectedRows();
    if(selected && selected.length > 0){
      if(reject){
        this.approveStatus = 2;
        this.modalElements = {
          title:"Reject Leave Application",
          body:"Are you sure you want to reject these leave application(s)"
        };
      }else{
        this.approveStatus = 1;
        this.modalElements = {
          title:"Approve Leave Application",
          body:"Are you sure you want to approve these leave application(s)"
        };
      }
      $("#approveLeaveApplication").modal('show');
    }else{
      this.alertSuccessErrorMsg(false, "Please select a row!!",false);
    }
  }

  saveApproveLeaveApplication(){
    let selected = this.gridApi.getSelectedRows();
    if(selected && selected.length > 0){
      let row_ids = selected.map(function(d){ return d.row_id;});
      let obj = {
        row_ids:row_ids,
        status:this.approveStatus
      };
      this.superadminService.approveLeaveApplication(obj).subscribe(res => {
        if(res.status){
          $("#approveLeaveApplication").modal('hide');
          this.getLeaveApplicationList();
          this.alertSuccessErrorMsg(res.status, res.message,false);
        }else{
          this.alertSuccessErrorMsg(res.status, res.message,false);
        }
      });
    }else{
      $("#approveLeaveApplication").modal('hide');
      this.alertSuccessErrorMsg(false, "Please select a row!!",false);
    }
  }


  getLeaveApplicationList(){
    let obj = {};
    this.superadminService.getLeaveApplicationList(obj).subscribe(res => {
      if(res.status){
        this.rowData = res.data;
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

  selectMonthChange(selectMonth){
    console.log('selectMonth--',selectMonth)
  }
}
