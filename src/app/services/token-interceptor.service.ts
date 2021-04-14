import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { tap, catchError, map } from "rxjs/operators";
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService  implements HttpInterceptor {
  cookie:any ;
  hrCookie:any ;
  token:any ;
  hrToken:any ;
  externalUrl:any;
  constructor(private cookieService : CookieService){
    this.externalUrl = environment.SOCKET_ENDPOINT;
    // get employee cookie
    if(this.cookieService.get('user')){
      this.cookie = JSON.parse(this.cookieService.get('user')) ;
      this.token = this.cookie['token'];
    }else{
      console.log('no employee cookie present!!')
    }
    // get hr login cookie
    if(this.cookieService.get('superadmin')){
      this.hrCookie = JSON.parse(this.cookieService.get('superadmin')) ;
      this.hrToken = this.hrCookie['token'];
    }else{
      console.log('no superadmin cookie present!!')
    }
  }

  intercept(request: HttpRequest<any>, next: HttpHandler):
  Observable<HttpEvent<any>> {
    let user_type = '';
    if(request.method == 'GET'){
      user_type = request.params.get('user_type');
    }else{
      user_type = request.body.user_type; 
    }
    let newHeaders = request.headers;
    // check user type and set token accordingly
    if(user_type == 'superadmin'){
      if(this.hrToken){
        newHeaders = newHeaders.append('Authorization', this.hrToken);
      }
    }else{
      if(this.token){
        newHeaders = newHeaders.append('Authorization', this.token);
      }
    }

    const authReq = request.clone({headers: newHeaders
      .set('Cache-Control', 'no-cache')
      .set('Pragma', 'no-cache')
      .set('Expires', '0')
      .set('If-Modified-Since', '0')
    });

    return next.handle(authReq).pipe(catchError((err:HttpErrorResponse) => {
      if (err) {
        if (err.status === 401) {
          if(user_type == 'superadmin'){
            window.open(this.externalUrl+"/superadmin", '_self');
          }else{
            window.open(this.externalUrl, '_self');
          }
          // redirect to the login route
          // or show a modal
        }
      }
      return throwError(err);
    }));
  }
}
