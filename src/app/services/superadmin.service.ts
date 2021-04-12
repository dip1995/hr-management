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

  getVeevaAccountAndUserFields(body:any) : Observable<any> {
    body.user_type = 'superadmin';
    return this.http.get<any>(this.local_url+'/api/superadmin/getVeevaAccountAndUserFields',{ params: body});
  }

}
