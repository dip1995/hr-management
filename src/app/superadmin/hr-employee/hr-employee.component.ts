import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

@Component({
  selector: 'app-hr-employee',
  templateUrl: './hr-employee.component.html',
  styleUrls: ['./hr-employee.component.css']
})
export class HrEmployeeComponent implements OnInit {
  addUpdateEmployee:boolean = false;
   session:boolean = false;
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
  }

  addEmployee(){
    this.addUpdateEmployee = true;
  }

  addUpdateEmployeeDetails(){
  }

  endSession(){
   this.session = true;
  }

  onDelete(){

  }

}
