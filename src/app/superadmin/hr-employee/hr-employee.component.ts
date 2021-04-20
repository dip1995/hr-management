import { Component, OnInit,ViewChild} from '@angular/core';
import { FormArray, FormsModule, NgForm, FormBuilder , Validators, FormControl} from '@angular/forms';
import { Router } from '@angular/router';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { CookieService } from 'ngx-cookie-service';
import { AlertMessagesComponent } from 'src/app/common-module/alert-messages/alert-messages.component';
import { SuperadminService } from 'src/app/services/superadmin.service';
import { RequestOptions, Headers, Http } from '@angular/http';
import { environment } from 'src/environments/environment';
declare var $:any;

@Component({
  selector: 'app-hr-employee',
  templateUrl: './hr-employee.component.html',
  styleUrls: ['./hr-employee.component.css']
})
export class HrEmployeeComponent implements OnInit {
  @ViewChild(AlertMessagesComponent,{static:false}) alertmessage: AlertMessagesComponent;
  isSubmit:any=false;
  isEndSessionSubmit:any=false;
  file:any;
  fileName:any = "";
  employeeError:any = false;
  employeeErrorMessage:any = "";
  addUpdateEmployee:boolean = false;
  local_url = environment.LOCAL_API_URL ; // localhost
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
   employee_data:any = {};
   employeeList = [];
   employeeEndDate = "";
   importFile = false;
   userCookie:any;
  constructor(private router : Router,private superadminService : SuperadminService,
    private cookieService : CookieService,private fb : FormBuilder) {
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
        headerName: 'Name',
        field: 'name',
        flex:1,
        cellClass: 'ag-grid-cell-border',
      },
      {
        headerName: 'Mobile',
        field: 'mobile',
        type: 'numberColumn',
        flex:1,
        cellClass: 'ag-grid-cell-border',
      },
      {
        headerName: 'Email',
        field: 'email',
        flex:1,
        cellClass: 'ag-grid-cell-border',
      },
      {
        headerName: 'Salary',
        field: 'salary',
        type: 'numberColumn',
        flex:1,
        cellClass: 'ag-grid-cell-border',
      },
      {
        headerName: 'Joining Date',
        field: 'start_date',
        type: ['dateColumn', 'nonEditableColumn'],
        // width: 220,
        cellClass: 'ag-grid-cell-border',
        flex:1,
        cellRenderer: (data) => {
          return data.value ? (new Date(data.value)).toLocaleDateString() : '';
        }
      },
      {
        headerName: 'Increment Date',
        field: 'increament_date',
        type: ['dateColumn', 'nonEditableColumn'],
        // width: 220,
        cellClass: 'ag-grid-cell-border',
        flex:1,
        cellRenderer: (data) => {
          return data.value ? (new Date(data.value)).toLocaleDateString() : '';
        }
      },
      {
        headerName: 'Leave Credit',
        field: 'leave_credit',
        type: 'numberColumn',
        cellClass: 'ag-grid-cell-border',
        flex:1,
      },
      {
        headerName: 'Document Upload',
        field: 'document',
        cellClass: 'ag-grid-cell-border',
        flex:1,
        onCellClicked: (params)=> {
          this.downloadDocument(params);
        },
        cellRenderer: (params)=> {
          return params.value ? '<a class="ag-grid-link"><i class="fa fa-download"></i> Download</a>' : "";
        },
      },
      {
        headerName: 'Created On',
        field: 'created_on',
        type: ['dateColumn'],
        flex:1,
        filter: "agTextColumnFilter",
        cellClass: 'ag-grid-cell-border',
        cellRenderer: (data) => {
          return data.value ? (new Date(data.value)).toLocaleDateString() : '';
        }
      },
      {
        headerName: 'Action',
        field: 'userid',
        flex:1,
        cellClass: 'ag-grid-cell-border',
        onCellClicked: (params)=> {
          this.editEmployee(params);
        },
        cellRenderer: (params)=> {
          return '<a class="ag-grid-link"><i class="fa fa-pencil"></i></a>'
        },
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

  exportEmployeeGrid() {
    const params = {
      columnGroups: true,
      allColumns: false,
      columnKeys:['Sno','name','mobile','email','salary','start_date','increament_date','leave_credit','document','created_on'],
      fileName: 'employee_data',
    };
    this.gridApi.exportDataAsCsv(params);
  }

  addUpdateEmployeeForm = this.fb.group({
    id: 0,
    name : ['' ,Validators.required],
    mobile : ['' ,Validators.required],
    email : ['' ,Validators.required],
    salary : ['' ,Validators.required],
    start_date : ['' ,Validators.required],
    increament_date : ['' ,Validators.required],
    leave_credit : ['' ,Validators.required],
    document : [''],
    file : [''],
    password : [''],
    changePassword:['']
  });

  ngOnInit(): void {
    this.userCookie = (this.cookieService.get('epsuperadmin')) ? JSON.parse(this.cookieService.get('epsuperadmin')) : {} ;
    this.hrEmployeeList();
  }

  downloadDocument(params) {
    var path = this.local_url+"/uploads/documents/"+params.value;
    const linkElement = document.createElement('a');
    var url = path+"?token="+this.userCookie.token;
    linkElement.setAttribute('href', url);
    linkElement.setAttribute("download", params.value);
    var clickEvent = new MouseEvent("click", {
        "view": window,
        "bubbles": true,
        "cancelable": false
    });
    setTimeout(() => {
      linkElement.dispatchEvent(clickEvent);
    }, 100);
  }

  addEmployee(){
    this.addUpdateEmployeeForm.reset();
    this.addUpdateEmployee = !this.addUpdateEmployee;
  }

  addUpdateEmployeeDetails(addUpdateEmployeeForm){
    this.isSubmit = true;
    this.employee_data = addUpdateEmployeeForm.value;
    if(addUpdateEmployeeForm.status == "VALID"){
      this.employee_data.document = this.fileName;
      this.superadminService.addUpdateEmployeeDetails(this.employee_data).subscribe(res => {
        if(res.status){
          this.isSubmit = false;
          this.addUpdateEmployee = false;
          this.addUpdateEmployeeForm.reset();
          this.hrEmployeeList();
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
          this.employee_data = this.addUpdateEmployeeForm.value;
          this.employee_data.document = res.data.filename;
          this.fileName = res.data.filename;
          this.importFile = true;
          this.addUpdateEmployeeForm.patchValue(this.employee_data);
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
      if(res.status){
        this.employeeList = res.data;
      }else{
        this.alertSuccessErrorMsg(res.status, res.message,false);
      }
    });
  }

  openEndSessionModal(){
    this.isEndSessionSubmit = false;
    this.employeeEndDate = "";
    let selected = this.gridApi.getSelectedRows();
    if(selected && selected.length > 0){
      $("#endSessionModal").modal('show');
    }else{
      this.alertSuccessErrorMsg(false, "Please select a row!!",false);
    }
  }

  endEmployeeSession(){
    this.isEndSessionSubmit = true;
    let selected = this.gridApi.getSelectedRows();
    if(selected && selected.length > 0){
      let obj = {
        id:selected[0].userid
      };
      this.superadminService.endEmployeeSession(obj).subscribe(res => {
        if(res.status){
          $("#endSessionModal").modal('hide');
          this.hrEmployeeList();
          this.alertSuccessErrorMsg(res.status, res.message,false);
        }else{
          this.alertSuccessErrorMsg(res.status, res.message,false);
        }
      });
    }else{
      $("#endSessionModal").modal('hide');
      this.alertSuccessErrorMsg(false, "Please select a row!!",false);
    }
  }

  deleteEmployee(){
    let selected = this.gridApi.getSelectedRows();
    if(selected && selected.length > 0){
      let row_ids = selected.map(function(d){ return d.row_id;});
      let obj = {
        row_ids:row_ids
      };
      // this.superadminService.deleteEmployee(obj).subscribe(res => {
      //   if(res.status){
      //     this.alertSuccessErrorMsg(res.status, res.message,false);
      //   }else{
      //     this.alertSuccessErrorMsg(res.status, res.message,false);
      //   }
      // });
    }else{
      $("#deleteEmployeeModal").modal('hide');
      this.alertSuccessErrorMsg(false, "Please select a row!!",false);
    }
  }

  openDeleteEmployeeModal(){
    let selected = this.gridApi.getSelectedRows();
    if(selected && selected.length > 0){
      $("#deleteEmployeeModal").modal('show');
    }else{
      this.alertSuccessErrorMsg(false, "Please select a row!!",false);
    }
  }

  editEmployee(params){
    let obj = {id:params.value};
    this.superadminService.getEmployeeDetailsById(obj).subscribe(res => {
      if(res.status){
        if(res.data && res.data.length > 0){
          this.isSubmit = false;
          this.addUpdateEmployee = true;
          this.employee_data = {
            id: res.data[0].userid,
            name : res.data[0].name,
            mobile : res.data[0].mobile,
            email : res.data[0].email,
            salary : res.data[0].salary,
            start_date : this.convertDateToReadableString(res.data[0].start_date),
            increament_date : this.convertDateToReadableString(res.data[0].increament_date),
            leave_credit : res.data[0].leave_credit,
            document : res.data[0].document,
            password : '',
            changePassword:false,
          };
          this.importFile = res.data[0].document ? true : false;
          this.addUpdateEmployeeForm.patchValue(this.employee_data);
        }else{
          this.alertSuccessErrorMsg(false, "Employee not found!!",false);
        }
      }else{
        this.alertSuccessErrorMsg(res.status, res.message,false);
      }
    });
  }

  changeImportFile(){
    this.importFile = !this.importFile;
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

  alertSuccessErrorMsg(status,message,navigationEvent){
    this.alertmessage.callAlertMsgMethod(true,message,navigationEvent);
  }

}
