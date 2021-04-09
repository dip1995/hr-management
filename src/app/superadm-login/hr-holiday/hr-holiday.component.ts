import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hr-holiday',
  templateUrl: './hr-holiday.component.html',
  styleUrls: ['./hr-holiday.component.css']
})
export class HrHolidayComponent implements OnInit {

  holidayName;
  holidayDate;
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
  
  constructor(private router : Router) {
   this.columnDefs = [
     {
       headerName: 'Sno',
       field: 'Sno',
     },
     {
       headerName: 'Date',
       field: 'date',
       type: ['dateColumn', 'nonEditableColumn'],
       width: 220,
     },
     {
       headerName: 'Day',
       field: 'Day',
     },
     {
       headerName: 'Holiday/Events',
       field: 'Holiday/Events',
       // type: 'numberColumn',
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
  }
  
  addHoliday(){
     this.holiday = true;
     
    }
  
  
  }
  