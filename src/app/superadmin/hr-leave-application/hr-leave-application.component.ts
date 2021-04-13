import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

@Component({
  selector: 'app-hr-leave-application',
  templateUrl: './hr-leave-application.component.html',
  styleUrls: ['./hr-leave-application.component.css']
})
export class HrLeaveApplicationComponent implements OnInit {

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

 constructor(private router : Router) {
   this.columnDefs = [
     {
       headerName: 'Name',
       field: 'Name',
     },
     {
       headerName: 'Date From',
       field: 'Date From',
       type: ['dateColumn', 'nonEditableColumn'],
       width: 220,
     },
     {
       headerName: 'Date To',
       field: 'Date To',
       type: ['dateColumn', 'nonEditableColumn'],
       width: 220,
     },
     {
       headerName: 'Description',
       field: 'Description',
      //  type: 'file',
     },
     {
      headerName: 'Total Leave',
      field: 'Total Leave',
      type: 'numberType',
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

  }
 
}