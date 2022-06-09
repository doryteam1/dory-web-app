import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-stars',
  templateUrl: './stars.component.html',
  styleUrls: ['./stars.component.scss']
})
export class StarsComponent implements OnInit {
  overStar = 0;
  @Input() size:string = 'medium';
  @Input() selectedStar:number = -1;
  @Input() editMode:boolean = false;
  @Output() rating = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {
  }

  mouseOver(i:number){
    this.overStar = i;
  }

  mouseOut(i:number)
  {
    if(i==0){
      this.overStar = -1;
    }
  }

  onClick(i:number){
    if(this.selectedStar == -1 || this.editMode == true){
      this.selectedStar = i;
      this.rating.emit(this.selectedStar)
    }
  }
}
