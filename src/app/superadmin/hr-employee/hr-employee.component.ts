import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hr-employee',
  templateUrl: './hr-employee.component.html',
  styleUrls: ['./hr-employee.component.css']
})
export class HrEmployeeComponent implements OnInit {
  addUpdateEmployee:boolean = true;
  constructor() { }

  ngOnInit(): void {
  }

  addUpdateEmployeeDetails(){

  }

}
