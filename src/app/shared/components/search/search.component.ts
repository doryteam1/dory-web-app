import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  @Output() textSearch:EventEmitter<string> = new EventEmitter();
  text:string = '';
  constructor() { }

  ngOnInit(): void {
  }

  onEnterKey(){
    if(this.text && this.text != ''){
      this.textSearch.emit(this.text);
    }
  }
}
