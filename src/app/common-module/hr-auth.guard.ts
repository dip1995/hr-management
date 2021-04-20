import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class HrAuthGuard implements CanActivate {
  constructor(private cookieService : CookieService, private router: Router){
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
    {
      let externalUrl = environment.SOCKET_ENDPOINT;
     let isLoggedIn = (this.cookieService.get('epsuperadmin')) ? JSON.parse(this.cookieService.get('epsuperadmin')).login : false ;

     if(isLoggedIn)
          return true;

      // this.cookieService.delete('epsuperadmin',  ' / ' ,  'localhost');
      // this.cookieService.delete('epsuperadmin');
      window.open(externalUrl+'/superadmin/login', '_self');
      return false;
  }
}
