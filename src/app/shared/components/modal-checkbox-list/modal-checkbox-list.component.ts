import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-checkbox-list',
  templateUrl: './modal-checkbox-list.component.html',
  styleUrls: ['./modal-checkbox-list.component.scss'],
})
export class ModalCheckboxListComponent implements OnInit {
  @Input() titleModal: string = '';
  @Input() arrayCheckbox: any[] = [];
  checkArray:any[]= []
  constructor(private _modalService: NgbActiveModal) {}

  ngOnInit(): void {}
  public decline() {
    this._modalService.close(false);
  }
  public accept() {
    this._modalService.close(true);
  }
  public dismiss() {
    this._modalService.dismiss();
  }
  onCheckboxChange(e: any, controlName: string) {
    console.log(e)
    if (e.target.checked) {
     this. checkArray.push(e.target.value);
      console.log(this.checkArray)
    } else {
         let i: number = 0;
         this.checkArray.forEach(
           (
             item,
             i: number,
           ) => {
             if (item == e.target.value) {
               this.checkArray.splice(i,1);
               return;
             }
             i++;
            }
            );
            console.log(this.checkArray)
    }
  }

  isChecked(controlName: string, value: number) {
/*     let checked: boolean = false;
    const checkArray: FormArray = this.form.get(controlName) as FormArray;
    checkArray.controls.forEach(
      (item: AbstractControl, i: number, controls: Array<AbstractControl>) => {
        if (item.value == value) {
          checked = true;
        }
      }
    );
    return checked; */
  }
}
