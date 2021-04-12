import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AgGridModule } from 'ag-grid-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModuleModule } from './common-module/common-module.module';
import { SuperadminModule } from './superadmin/superadmin.module';
import { EmployeeModule } from './employee/employee.module';
import { RouterModule, Routes } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';


const routes: Routes = [
    {
      path: 'superadmin',
      loadChildren : ()=> import('./superadmin/superadmin.module').then(m => m.SuperadminModule)
    },
    {
      path: '',
      loadChildren : ()=> import('./employee/employee.module').then(m => m.EmployeeModule)
    },
];
@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AgGridModule.withComponents([]),
    BrowserAnimationsModule,
    CommonModuleModule,
    CommonModule,
    SuperadminModule,
    EmployeeModule,
    
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
