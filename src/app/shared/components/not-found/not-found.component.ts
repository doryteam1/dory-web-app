import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent implements OnInit {
  @Input() objectName: string = 'objetos';
  @Input() message: string = '';
  @Input() genericError: boolean = false;
  @Input() errorData: boolean = false;
  constructor() {}

  ngOnInit(): void {}
}
