import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-item-data',
  templateUrl: './card-item-data.component.html',
  styleUrls: ['./card-item-data.component.scss'],
})
export class CardItemDataComponent implements OnInit {
  @Input() dataNumber: any;
  @Input() title!:string;
  @Input() icon!: string;
  @Input() styleColor!: string;
  constructor() {}

  ngOnInit(): void {}
}
