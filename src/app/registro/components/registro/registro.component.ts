import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {
  @Output() exit: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }

  exiting(event:any){
    console.log("exit reg")
    this.exit.emit(true)
  }
}
