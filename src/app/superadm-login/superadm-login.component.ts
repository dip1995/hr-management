import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-superadm-login',
  templateUrl: './superadm-login.component.html',
  styleUrls: ['./superadm-login.component.css']
})
export class SuperadmLoginComponent implements OnInit {


  constructor(private router: Router) { }
 
  public formData;
  public SubmitClick(f){
   if(f.valid){
   this.formData  = f.value;
    console.log(this.formData); 
    this.router.navigate(['dailywork']);
   }
  }



  ngOnInit(): void {
  }

}
