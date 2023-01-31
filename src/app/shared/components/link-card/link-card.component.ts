import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-link-card',
  templateUrl: './link-card.component.html',
  styleUrls: ['./link-card.component.scss']
})
export class LinkCardComponent implements OnInit {
  @Input() urlImagen:string = 'assets/images/granja.svg'
  @Input() title:string = 'Card Title'
  @Input() links:Array<any> = [
    {
      title:'Link1',
      route:'/manual'
    },
    {
      title:'Link2',
      route:'/manual'
    },
    {
      title:'Link3',
      route:'/manual'
    },
    {
      title:'Link4',
      route:'/manual'
    }
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
