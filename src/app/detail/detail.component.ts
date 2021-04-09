import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {

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
 
 
  addItem() {
    this.arr = this.myForm.get('arr') as FormArray;
    this.arr.push(this.createItem());
  }

  
removeItem(i:number) {
  this.arr.removeAt(i);
}

  onSubmit() { 
    console.log(this.myForm.value);
  }

  onCancel(){
    this.myForm.reset();
   }
 
}