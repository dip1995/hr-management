import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  local_url = environment.LOCAL_API_URL; // localhost
  token: any;
  userid: any;
  httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  options = {
    headers: this.httpHeaders,
  };

  constructor(private http: HttpClient) {}

  /////////////////////////http request/////////////////////////////////

  employeeLogin(body: any): Observable<any> {
    return this.http.post<any>(
      this.local_url + '/api/employeelogin/login',
      body
    );
  }

  employeeLogout(body: any): Observable<any> {
    return this.http.post<any>(this.local_url + '/api/logout/logout', body);
  }

  getEmployeeDetailsById(body: any): Observable<any> {
    return this.http.get<any>(
      this.local_url + '/api/employee/getEmployeeDetailsById',
      { params: body }
    );
  }

  getWorkingMonthsList(body: any): Observable<any> {
    return this.http.get<any>(
      this.local_url + '/api/employee/getWorkingMonthsList',
      { params: body }
    );
  }

  getEmployeesDailyWorksheetData(body: any): Observable<any> {
    return this.http.get<any>(
      this.local_url + '/api/employee/getEmployeesDailyWorksheetData',
      { params: body }
    );
  }

  getEmployeesDailyWorkByDate(body: any): Observable<any> {
    return this.http.get<any>(
      this.local_url + '/api/employee/getEmployeesDailyWorkByDate',
      { params: body }
    );
  }

  addUpdateDailyWorkData(body: any): Observable<any> {
    return this.http.post<any>(
      this.local_url + '/api/employee/addUpdateDailyWorkData',
      body
    );
  }

  addUpdateLeaveApplication(body: any): Observable<any> {
    return this.http.post<any>(
      this.local_url + '/api/employee/addUpdateLeaveApplication',
      body
    );
  }

  updatePassword(body: any): Observable<any> {
    return this.http.post<any>(
      this.local_url + '/api/employee/updatePassword',
      body
    );
  }

  deleteDailyWorkData(body: any): Observable<any> {
    return this.http.post<any>(
      this.local_url + '/api/employee/deleteDailyWorkData',
      body
    );
  }

  deleteLeaveApplication(body: any): Observable<any> {
    return this.http.post<any>(
      this.local_url + '/api/employee/deleteLeaveApplication',
      body
    );
  }

  getLeaveApplicationListByEmployee(body: any): Observable<any> {
    return this.http.get<any>(
      this.local_url + '/api/employee/getLeaveApplicationListByEmployee',
      { params: body }
    );
  }

  getBusinessHolidayList(body: any): Observable<any> {
    return this.http.get<any>(
      this.local_url + '/api/superadmin/getBusinessHolidayList',
      { params: body }
    );
  }

  getEmployeeReportCard(body: any): Observable<any> {
    return this.http.get<any>(
      this.local_url + '/api/employee/getEmployeeReportCard',
      { params: body }
    );
  }
  exportEmployeeWorkSheetData(body: any): Observable<any> {
    return this.http.get<any>(
      this.local_url + '/api/employee/exportEmployeeWorkSheetData',
      { params: body }
    );
  }
  get_Time() {
    var min = 60;
    var ms = 1000;
    return new Date().getTimezoneOffset() * min * ms;
  }
}
