import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-leave-application',
  templateUrl: './leave-application.component.html',
  styleUrls: ['./leave-application.component.css']
})
export class LeaveApplicationComponent implements OnInit {
  data;
  selectMonth;
 dateFromDisable;
 dateToDisable;
 todayDate = new Date();

 constructor() { }

  ngOnInit(): void {

  }

  dateFrom(){
    let year =  this.todayDate.getFullYear();
    let month = (this.todayDate.getMonth() > 9 ? this.todayDate.getMonth()+1 : "0"+(this.todayDate.getMonth()+1));
    let day = (this.todayDate.getDate() > 9 ? this.todayDate.getDate() : "0"+(this.todayDate.getDate()));
    this.dateFromDisable = year + "-" + month + "-" + day;
    console.log(this.dateFromDisable);

    return this.dateFromDisable;


  }

  toFrom(){
    this.dateToDisable = this.todayDate;
  }


  submitLeaveApplication(obj){

    this.data = obj;
    console.log(obj);
  }

  onCancel(f: NgForm){
   f.form.reset();
  }
}
