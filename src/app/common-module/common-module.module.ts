import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertMessagesComponent } from './alert-messages/alert-messages.component';
import { LoaderComponent } from './loader/loader.component';
import { HeaderComponent } from './header/header.component';
import { Routes, RouterModule } from '@angular/router';
import { LoaderService } from '../services/loader.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { LoaderInterceptor } from './loader.interceptor';
import { TokenInterceptorService } from '../services/token-interceptor.service';
import { DailyWorkListComponent } from './daily-work-list/daily-work-list.component';

@NgModule({
  declarations: [AlertMessagesComponent, LoaderComponent, HeaderComponent, DailyWorkListComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
    HeaderComponent,
    LoaderComponent,
    DailyWorkListComponent,
    AlertMessagesComponent
  ],
  providers: [LoaderService, TokenInterceptorService  , CookieService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true}
  ]
})
export class CommonModuleModule { }
