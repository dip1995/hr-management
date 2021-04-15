import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-daily-work-detail',
  templateUrl: './daily-work-detail.component.html',
  styleUrls: ['./daily-work-detail.component.css']
})
export class DailyWorkDetailComponent implements OnInit {

  name = 'Angular';
  myForm: FormGroup;
  arr: FormArray;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      arr: this.fb.array([this.createItem()])
    })
  }

  createItem() {
    return this.fb.group({
      date:'',
      starttime: [''],
      endtime: [''],
      moduleName: [''],
      description: ['']
    })
  }
 
 
  addDailyWorkDetail(){
    this.arr = this.myForm.get('arr') as FormArray;
    this.arr.push(this.createItem());
  }

  
  removeDailyWorkDetail(i:number) {
  this.arr.removeAt(i);
}

saveDailyWorkDetail(){ 
    console.log(this.myForm.value);
  }

  cancelDailyWorkDetail(){
    this.myForm.reset();
   }
 
}