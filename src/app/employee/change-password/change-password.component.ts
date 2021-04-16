import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  data;
  constructor() { }

  ngOnInit(): void {
  }

  saveChangePassword(f){
   this.data = f;  
  }
}
