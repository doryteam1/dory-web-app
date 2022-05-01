import { Component, Input, OnInit } from '@angular/core';
import { TopAlertControllerService } from '../../services/top-alert-controller.service';
import { AlertMessage } from '../../../../models/alert-message.model';

@Component({
  selector: 'app-top-alert',
  templateUrl: './top-alert.component.html',
  styleUrls: ['./top-alert.component.scss']
})
export class TopAlertComponent implements OnInit {
  message = '';
  show:boolean = false;
  constructor(private topAlertController:TopAlertControllerService) { }

  ngOnInit(): void {
    this.topAlertController.getListener().subscribe(
      (messageAllert:AlertMessage)=>{
        this.message = messageAllert.message;
        this.show = true;
        setTimeout(()=>{
          this.show = false;
        },messageAllert.milliseconds)
      }
    )
  }

}
