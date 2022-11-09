import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-simple-checkbox-switch',
  templateUrl: './simple-checkbox-switch.component.html',
  styleUrls: ['./simple-checkbox-switch.component.scss'],
})
export class SimpleCheckboxSwitchComponent implements OnInit {
  @Input() selectCheckbox: number = 0;
  @Output() onSelectCheckbox: EventEmitter<number> = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}
  onCheckboxChange(e: any) {
    if (e.target.checked) {
      this.onSelectCheckbox.emit(1)
    } else {
      this.onSelectCheckbox.emit(0);
    }
  }
}
