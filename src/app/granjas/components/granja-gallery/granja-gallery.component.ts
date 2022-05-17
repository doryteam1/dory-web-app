import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-granja-gallery',
  templateUrl: './granja-gallery.component.html',
  styleUrls: ['./granja-gallery.component.scss']
})
export class GranjaGalleryComponent implements OnInit {
  @Input() photos=[];
  constructor() { }

  ngOnInit(): void {
  }

}
