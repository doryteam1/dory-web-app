import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-basic-message',
  templateUrl: './basic-message.component.html',
  styleUrls: ['./basic-message.component.scss']
})
export class BasicMessageComponent implements OnInit {
  @Input() title:string = 'Enviado satisfactoriamente.';
  @Input() message:string = '';
  @Input() callToAction:string = 'De clic en “aceptar”  para volver a inicio';
  @Input() btnName:string = 'Aceptar';
  @Input() redirectTo:string = '/home';
  
  constructor() { }

  ngOnInit(): void {
  }

}
