import { Component, Input, OnInit } from '@angular/core';
interface dropdownData{
  icon:string,
  title:string,
  url:string
}
@Component({
  selector: 'app-target-desplegable',
  templateUrl: './target-desplegable.component.html',
  styleUrls: ['./target-desplegable.component.scss'],
})
export class TargetDesplegableComponent implements OnInit {
  classActive: boolean = false;
  @Input() title: string = '';
  @Input() contentTitle: string = '';
  @Input() titleButton: string = '';
  @Input() titleLogo: string = '';
  @Input() dropdownData: dropdownData[] = [];

  constructor() {}

  ngOnInit(): void {}
  openData() {
    if (this.classActive) {
      this.classActive = false;
    } else {
      this.classActive = true;
    }
  }
}
