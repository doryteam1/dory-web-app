import { Component, OnInit } from '@angular/core';
import { ElectronjsService } from 'src/app/services/electronjs.service';

@Component({
  selector: 'app-control-bar',
  templateUrl: './control-bar.component.html',
  styleUrls: ['./control-bar.component.scss']
})
export class ControlBarComponent implements OnInit {

  constructor(private _electronService: ElectronjsService) { }

  ngOnInit(): void {
  }

  buttonMin(){
  this._electronService?.send('min-button');
  this._electronService.removeAllListeners('min-button');
  }
  buttonMax(){
  this._electronService?.send('max-button');
  this._electronService.removeAllListeners('max-button');
  }
  buttonClose(){
  this._electronService?.send('close-button');
  this._electronService.removeAllListeners('close-button');
  }
    
}
