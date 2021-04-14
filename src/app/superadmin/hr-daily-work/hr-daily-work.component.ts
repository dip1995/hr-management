import { Component, OnInit,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
// declare var $:any;
// import * as $ from "jquery";

@Component({
  selector: 'app-hr-daily-work',
  templateUrl: './hr-daily-work.component.html',
  styleUrls: ['./hr-daily-work.component.css']
})
export class HrDailyWorkComponent implements OnInit {

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
  // autoGroupColumnDef;

 constructor(private router : Router) {
    this.columnDefs = [
     {
       headerName: 'Sno',
       field: 'Sno', 
      //  checkboxSelection:true,
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

}

}
