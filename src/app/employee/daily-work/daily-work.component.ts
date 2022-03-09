import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormsModule,
  NgForm,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { CookieService } from 'ngx-cookie-service';
import { AlertMessagesComponent } from 'src/app/common-module/alert-messages/alert-messages.component';
import { DailyWorkListComponent } from 'src/app/common-module/daily-work-list/daily-work-list.component';
import { EmployeeService } from 'src/app/services/employee.service';
import { environment } from 'src/environments/environment';
declare var $: any;

@Component({
  selector: 'app-daily-work',
  templateUrl: './daily-work.component.html',
  styleUrls: ['./daily-work.component.css'],
})
export class DailyWorkComponent implements OnInit {
  name = 'Angular';
  dailyWorkForm: FormGroup;
  workArray: FormArray;
  dailyWorkAdd: boolean = false;
  // constructor(private fb: FormBuilder) { }
  isSubmit: any = false;
  daily_work_Error: any = false;
  daily_work_ErrorMessage: any = '';
  @ViewChild(AlertMessagesComponent, { static: false })
  alertmessage: AlertMessagesComponent;
  @ViewChild(DailyWorkListComponent, { static: false })
  dailyWorkComponent: DailyWorkListComponent;

  isShow = false;
  selectMonth: any;
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
  dailyWork_data = [];
  dailyWorkFormData = {};
  workByDate = [];
  monthList = [];
  userCookie: any = {};
  monthlyRadio: any = 1;
  daily_date: any;
  deletedRowIds: any = [];
  deleteSelectedRows: any = [];
  reportStartDate: string;
  reportEndDate: string;
  isReportSubmitted: boolean;
  maxDate: any = +new Date();
  superadminService: any;
  local_url = environment.LOCAL_API_URL;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private employeeService: EmployeeService,
    private cookieService: CookieService
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
        flex: 1,
        cellClass: 'ag-grid-cell-border',
      },
      {
        headerName: 'Sno',
        field: 'Sno',
        valueGetter: 'node.rowIndex + 1',
        filter: false,
        maxWidth: 100,
        minWidth: 100,
        cellClass: 'ag-grid-cell-border',
      },
      {
        headerName: 'Date',
        field: 'date',
        type: ['dateColumn'],
        width: 220,
        flex: 1,
        filter: 'agTextColumnFilter',
        cellClass: 'ag-grid-cell-border',
        onCellClicked: (params) => {
          this.editWorkByDate(params);
        },
        cellRenderer: (data) => {
          return data.value
            ? '<a class="ag-grid-link">' +
                new Date(data.value).toLocaleDateString() +
                '</a>'
            : '';
        },
      },
      {
        headerName: 'Module Name',
        field: 'module',
        flex: 1,
      },
      {
        headerName: 'Description',
        field: 'description',
        flex: 1,
      },

      {
        headerName: 'Start Time',
        field: 'start_time',
        type: 'numberColumn',
        cellRenderer: (data) => {
          return data.value ? this.formatAMPM(new Date(data.value)) : '';
        },
      },

      {
        headerName: 'End Time',
        field: 'end_time',
        type: 'numberColumn',
        cellRenderer: (data) => {
          return data.value ? this.formatAMPM(new Date(data.value)) : '';
        },
      },
      {
        headerName: 'Created On',
        field: 'created_on',
        type: 'numberColumn',
        cellRenderer: (data) => {
          return data.value ? new Date(data.value).toLocaleDateString() : '';
        },
      },
    ];

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
      columnKeys: [
        'Sno',
        'date',
        'module',
        'description',
        'start_time',
        'end_time',
        'created_on',
      ],
      fileName: 'employee_data',
    };
    this.gridApi.exportDataAsCsv(params);
  }

  ngOnInit() {
    this.userCookie = this.cookieService.get('epuser')
      ? JSON.parse(this.cookieService.get('epuser'))
      : {};
    this.dailyWorkForm = this.fb.group({
      date: ['', Validators.required],
      workArray: this.fb.array([this.createItem(0, '', '', '', '')]),
    });
    // this.getWorkingMonthsList();
    // this.dailyWorkData();
  }

  createItem(id, start_time, end_time, moduleName, description) {
    return this.fb.group({
      row_id: id,
      start_time: [start_time],
      end_time: [end_time],
      module: [moduleName, Validators.required],
      description: [description, Validators.required],
    });
  }

  addDailyWorkDetail() {
    this.workArray = this.dailyWorkForm.get('workArray') as FormArray;
    this.workArray.push(this.createItem(0, '', '', '', ''));
  }

  removeDailyWorkDetail(i: number) {
    if (
      this.workArray.controls &&
      this.workArray.controls.length > 0 &&
      this.workArray.controls[i] &&
      this.workArray.controls[i].value
    ) {
      if (this.workArray.controls[i].value.row_id) {
        this.deletedRowIds.push(this.workArray.controls[i].value.row_id);
      }
    }
    this.workArray.removeAt(i);
  }

  startTimeChanged(i: number) {
    if (
      this.dailyWorkForm.get('workArray') &&
      this.dailyWorkForm.get('workArray')['controls'] &&
      this.dailyWorkForm.get('workArray')['controls'].length > 0
    ) {
      $('#work_end_time_' + i).attr(
        'min',
        this.dailyWorkForm.get('workArray')['controls'][i].value.start_time
      );
    }
  }

  saveDailyWorkDetail(dailyWorkForm) {
    this.isSubmit = true;
    let dailyWorkFormData = dailyWorkForm.value;
    dailyWorkFormData.deleted_ids = this.deletedRowIds;
    if (dailyWorkForm.status == 'VALID') {
      this.employeeService
        .addUpdateDailyWorkData(dailyWorkFormData)
        .subscribe((res) => {
          if (res.status) {
            this.isSubmit = false;
            this.dailyWorkAdd = false;
            this.dailyWorkForm.reset();
            this.alertSuccessErrorMsg(res.status, res.message, false);

            this.dailyWorkComponent.dailyWorkData();
          } else {
            this.alertSuccessErrorMsg(res.status, res.message, false);
          }
        });
    }
  }

  cancelDailyWorkDetail() {
    this.deletedRowIds = [];
    this.dailyWorkAdd = false;
    this.dailyWorkForm.reset();
  }

  addUpdateDailyWorkData() {
    this.isSubmit = false;
    this.deletedRowIds = [];
    this.cancelDailyWorkDetail();
    this.workArray = this.dailyWorkForm.get('workArray') as FormArray;
    if (this.workArray.controls && this.workArray.controls.length > 1) {
      this.workArray.controls.forEach((d, i) => {
        if (i != 0) {
          this.removeDailyWorkDetail(i);
        }
      });
    }
    this.dailyWorkAdd = this.dailyWorkAdd ? false : true;

    this.isShow = !this.isShow;
  }

  dailyWorkData() {
    let obj = {
      id: this.userCookie.userid,
      monthly: this.monthlyRadio ? true : false,
      daily: this.monthlyRadio ? false : true,
      date: this.monthlyRadio
        ? this.selectMonth
          ? +this.selectMonth
          : ''
        : this.daily_date,
    };
    this.employeeService
      .getEmployeesDailyWorksheetData(obj)
      .subscribe((res) => {
        if (res.status) {
          this.dailyWork_data = res.data;
        } else {
          this.alertSuccessErrorMsg(res.status, res.message, false);
        }
      });
  }

  getWorkingMonthsList() {
    let obj = {};
    this.employeeService.getWorkingMonthsList(obj).subscribe((res) => {
      if (res.status) {
        this.monthList = res.data;
      } else {
        this.alertSuccessErrorMsg(res.status, res.message, false);
      }
    });
  }

  editWorkByDate(params) {
    //before edit blank module
    let workArray = this.dailyWorkForm.get('workArray') as FormArray;
    workArray.clear();

    let date = +params.value - this.employeeService.get_Time();
    let obj = {
      date: date,
    };
    this.deletedRowIds = [];
    this.employeeService.getEmployeesDailyWorkByDate(obj).subscribe((res) => {
      if (res.status) {
        this.isSubmit = false;
        this.dailyWorkAdd = true;
        this.workByDate = res.data;
        let items = [];
        let workData = res.data.map(function (d) {
          let sdate = new Date(d.start_time);
          let edate = new Date(d.end_time);
          let start_time =
            (sdate.getHours() > 9 ? sdate.getHours() : '0' + sdate.getHours()) +
            ':' +
            (sdate.getMinutes() > 9
              ? sdate.getMinutes()
              : '0' + sdate.getMinutes());
          let end_time =
            (edate.getHours() > 9 ? edate.getHours() : '0' + edate.getHours()) +
            ':' +
            (edate.getMinutes() > 9
              ? edate.getMinutes()
              : '0' + edate.getMinutes());
          return {
            row_id: d.row_id,
            start_time: start_time,
            end_time: end_time,
            module: d.module,
            description: d.description,
          };
        });
        this.dailyWorkFormData = {
          date: this.convertDateToReadableString(res.data[0].date),
          // workArray: workData
        };

        this.dailyWorkForm.patchValue(this.dailyWorkFormData);
        this.workArray = this.dailyWorkForm.get('workArray') as FormArray;
        if (this.workArray.controls && this.workArray.controls.length > 0) {
          this.workArray.controls.forEach((d, i) => {
            this.removeDailyWorkDetail(i);
          });
        }
        workData.forEach((d) => {
          this.workArray.push(
            this.createItem(
              d.row_id,
              d.start_time,
              d.end_time,
              d.module,
              d.description
            )
          );
        });
        $('html,body').animate(
          {
            scrollTop: $('.daily-work-div').offset().top,
          },
          500
        );
      } else {
        this.alertSuccessErrorMsg(res.status, res.message, false);
      }
    });
  }

  openDeleteWorkModal(selected) {
    // let selected = this.gridApi.getSelectedRows();
    this.deleteSelectedRows = selected;
    if (selected && selected.length > 0) {
      $('#deleteWorkDataModal').modal('show');
    } else {
      this.alertSuccessErrorMsg(false, 'Please select a row!!', false);
    }
  }

  deleteWorkData() {
    let selected = this.deleteSelectedRows;
    if (selected && selected.length > 0) {
      let row_ids = selected.map(function (d) {
        return d.row_id;
      });
      let obj = {
        row_ids: row_ids,
      };
      this.employeeService.deleteDailyWorkData(obj).subscribe((res) => {
        if (res.status) {
          $('#deleteWorkDataModal').modal('hide');
          this.deleteSelectedRows = [];
          this.alertSuccessErrorMsg(res.status, res.message, false);
          this.dailyWorkComponent.dailyWorkData();
        } else {
          this.alertSuccessErrorMsg(res.status, res.message, false);
        }
      });
    } else {
      $('#deleteWorkDataModal').modal('hide');
      this.alertSuccessErrorMsg(false, 'Please select a row!!', false);
    }
  }

  alertSuccessErrorMsg(status, message, navigationEvent) {
    this.alertmessage.callAlertMsgMethod(true, message, navigationEvent);
  }

  formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }

  selectMonthChange(selectMonth) {
    console.log('selectMonth--', selectMonth);
    this.dailyWorkData();
  }

  onItemChange() {
    this.daily_date = this.convertDateToReadableString(+new Date());
    this.dailyWorkData();
  }

  convertDateToReadableString(date) {
    let readable_date = '';
    if (date) {
      let newdate = new Date(date);
      let day =
        newdate.getDate() > 9 ? newdate.getDate() : '0' + newdate.getDate();
      let month =
        newdate.getMonth() > 8
          ? newdate.getMonth() + 1
          : '0' + (newdate.getMonth() + 1);
      let year = newdate.getFullYear();
      return year + '-' + month + '-' + day; //"2021-04-17"
    }
    return readable_date;
  }

  fromAndToDateChange(date, from_date_changes) {
    if (from_date_changes) {
      this.maxDate = +new Date(this.reportStartDate);
      let old_date = +new Date(this.reportEndDate);
      if (this.maxDate > old_date) {
        this.reportEndDate = this.reportStartDate;
      }
    }
  }

  openExportReportModal() {
    let date = new Date();
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1); // get current month first date
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    this.reportStartDate = this.convertDateToReadableString(firstDay);
    this.reportEndDate = this.convertDateToReadableString(lastDay);
    this.maxDate = +firstDay;
    this.isReportSubmitted = false;
    $('#exportReportModal').modal('show');
  }

  exportEmployeeReport() {
    if (this.reportStartDate && this.reportEndDate) {
      let obj = {
        offset: this.employeeService.get_Time(),
        from_date: this.reportStartDate,
        to_date: this.reportEndDate,
        id: this.userCookie.userid,
        monthly: this.monthlyRadio ? true : false,
        daily: this.monthlyRadio ? false : true,
        date: this.monthlyRadio
          ? this.selectMonth
            ? +this.selectMonth
            : ''
          : this.daily_date,
      };

      this.employeeService.exportEmployeeWorkSheetData(obj).subscribe((res) => {
        console.log(res);
        if (res.status) {
          $('#exportReportModal').modal('hide');
          var path = this.local_url + '/uploads/reports/' + res.data;
          const linkElement = document.createElement('a');
          var url = path + '?token=' + this.userCookie.token;
          linkElement.setAttribute('href', url);
          linkElement.setAttribute('download', res.data);
          var clickEvent = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: false,
          });
          setTimeout(() => {
            linkElement.dispatchEvent(clickEvent);
          }, 100);
          this.alertSuccessErrorMsg(res.status, res.message, false);
        } else {
          this.alertSuccessErrorMsg(res.status, res.message, false);
        }
      });
    }
  }
}
