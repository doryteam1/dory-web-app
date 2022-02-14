import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  @Output() textSearch:EventEmitter<string> = new EventEmitter();
  @Output() keyEnterPress:EventEmitter<string> = new EventEmitter();
  text:string = '';
  constructor() { }

  ngOnInit(): void {
  }

  onChange(){
    this.textSearch.emit(this.text);
  }

  onEnterPress(){
    console.log("press enter")
    this.keyEnterPress.emit(this.text);
  }
}
