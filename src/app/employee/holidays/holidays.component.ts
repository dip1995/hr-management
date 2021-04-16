import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-holidays',
  templateUrl: './holidays.component.html',
  styleUrls: ['./holidays.component.css']
})
export class HolidaysComponent implements OnInit {
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
  holiday_data1 = [];
  constructor(private router : Router) {
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
     width: 220,
     flex:1,
     filter: "agTextColumnFilter",
     cellClass: 'ag-grid-cell-border'
   },
   {
     headerName: 'Day',
     flex:1,
     field: 'Day',
   },
   {
     headerName: 'Holiday/Events',
     field: 'name',
     flex:1,
   }
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


  ngOnInit(): void {
  }

}
