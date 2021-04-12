import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
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

  employeeLogin(body:any) : Observable<any> {
    return this.http.post<any>(this.local_url+'/api/employeelogin/login',body);
  }

  employeeLogout(body:any) : Observable<any> {
    return this.http.post<any>(this.local_url+'/api/logout/logout',body);
  }

  getVeevaAccountAndUserFields(body:any) : Observable<any> {
    return this.http.get<any>(this.local_url+'/api/veeva/getVeevaAccountAndUserFields',{ params: body});
  }

}
