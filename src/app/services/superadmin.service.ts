import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SuperadminService {
  local_url = environment.LOCAL_API_URL ; // localhost
  token:any;
  userid:any;
  httpHeaders = new HttpHeaders({
    'Content-Type':'application/json',
  });

  options = {
    headers:  this.httpHeaders
  };

  constructor(private http : HttpClient) {}

/////////////////////////http request/////////////////////////////////

  superadminLogin(body:any) : Observable<any> {
    body.user_type = 'superadmin';
    return this.http.post<any>(this.local_url+'/api/superadminlogin/login',body);
  }

  superadminLogout(body:any) : Observable<any> {
    body.user_type = 'superadmin';
    return this.http.post<any>(this.local_url+'/api/logout/logout',body);
  }

  getEmployeeList(body:any) : Observable<any> {
    body.user_type = 'superadmin';
    return this.http.get<any>(this.local_url+'/api/superadmin/getEmployeeList',{ params: body});
  }

  addUpdateEmployeeDetails(body:any) : Observable<any> {
    body.user_type = 'superadmin';
    return this.http.post<any>(this.local_url+'/api/superadmin/addUpdateEmployeeDetails',body);
  }

  endEmployeeSession(body:any) : Observable<any> {
    body.user_type = 'superadmin';
    return this.http.post<any>(this.local_url+'/api/superadmin/endEmployeeSession',body);
  }

  approveLeaveApplication(body:any) : Observable<any> {
    body.user_type = 'superadmin';
    return this.http.post<any>(this.local_url+'/api/superadmin/approveLeaveApplication',body);
  }

  getAllEmployeeReportCard(body:any) : Observable<any> {
    body.user_type = 'superadmin';
    return this.http.get<any>(this.local_url+'/api/superadmin/getAllEmployeeReportCard',{ params: body});
  }

  uploadZipDocument(body:any) : Observable<any> {
    body.user_type = 'superadmin';
    return this.http.post<any>(this.local_url+'/api/superadmin/uploadZipDocument',body);
  }

  addUpdateBusinessHolidays(body:any) : Observable<any> {
    body.user_type = 'superadmin';
    return this.http.post<any>(this.local_url+'/api/superadmin/addUpdateBusinessHolidays',body);
  }

  deleteBusinessHolidays(body:any) : Observable<any> {
    body.user_type = 'superadmin';
    return this.http.post<any>(this.local_url+'/api/superadmin/deleteBusinessHolidays',body);
  }

  getBusinessHolidayList(body:any) : Observable<any> {
    body.user_type = 'superadmin';
    return this.http.get<any>(this.local_url+'/api/superadmin/getBusinessHolidayList',{ params: body});
  }

  getLeaveApplicationList(body:any) : Observable<any> {
    body.user_type = 'superadmin';
    return this.http.get<any>(this.local_url+'/api/superadmin/getLeaveApplicationList',{ params: body});
  }

  getEmployeesDailyWorksheetData(body:any) : Observable<any> {
    body.user_type = 'superadmin';
    return this.http.get<any>(this.local_url+'/api/employee/getEmployeesDailyWorksheetData',{ params: body});
  }

  getWorkingMonthsList(body:any) : Observable<any> {
    body.user_type = 'superadmin';
    return this.http.get<any>(this.local_url+'/api/employee/getWorkingMonthsList',{ params: body});
  }

}
