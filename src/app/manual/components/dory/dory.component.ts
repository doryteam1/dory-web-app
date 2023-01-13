import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dory',
  templateUrl: './dory.component.html',
  styleUrls: ['./dory.component.scss']
})
export class DoryComponent implements OnInit,AfterViewInit {
  baseUrl:string = environment.ginelectURL;
  constructor(private elRef:ElementRef) { 
  }
  
  ngAfterViewInit(): void {
    this.elRef.nativeElement.scrollIntoView();
  }

  ngOnInit(): void {
  }

}
