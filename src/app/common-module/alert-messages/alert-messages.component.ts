import { Component, OnInit, Input,Output,EventEmitter,ViewChild,ElementRef } from '@angular/core';
declare var $:any;

@Component({
  selector: 'app-alert-messages',
  templateUrl: './alert-messages.component.html',
  styleUrls: ['./alert-messages.component.css']
})
export class AlertMessagesComponent implements OnInit {
  @Output('navigateAfterMsgAlert') "navigateAfterMsgAlert": EventEmitter<any> = new EventEmitter();
  @Input('showSalesShareField') "showSalesShareField":boolean;
  @ViewChild('closeAlertModelEvent' , {static : false})
  private "closeAlertModelEvent" : ElementRef;
  status:any;
  message:any;
  constructor() { }

  ngOnInit(): void {

  }

  navigationEvent:boolean = true;
  callAlertMsgMethod(status:any,message:any,navEvent:any){
    this.navigationEvent = navEvent;
    this.status = status
    this.message = message
    if(this.message){
      if(this.status){
          $("#showSuccessMessage").modal('show');
      }else{
         this.close();
      }
    }
  }

  close() {
    this.closeAlertModelEvent.nativeElement.click();
  }

  navigateToNext(){
    this.close();
    this.navigateAfterMsgAlert.emit();
  }

}
