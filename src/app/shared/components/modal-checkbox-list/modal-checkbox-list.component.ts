import { Component,Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-checkbox-list',
  templateUrl: './modal-checkbox-list.component.html',
  styleUrls: ['./modal-checkbox-list.component.scss'],
})
export class ModalCheckboxListComponent implements OnInit {
  @Input() titleModal: string = '';
  @Input() arrayCheckbox: any[] = [];
  @Input() arrayCheckboxSelec: any[] = []
  checkArray: any[] = [];
  constructor(
    private _modalService: NgbActiveModal,
  ) {}

  ngOnInit(): void {
    if (this.arrayCheckboxSelec.length !==0) {
      this.checkArray = this.checkArray.concat(this.arrayCheckboxSelec);
    }
  }
  onCheckboxChange(e: any) {
    if (e.target.checked) {
      this.checkArray.push(e.target.value);
    } else {
      let i: number = 0;
      this.checkArray.forEach((item, i: number) => {
        if (item == e.target.value) {
          this.checkArray.splice(i, 1);
          return;
        }
        i++;
      });
    }
  }

  isChecked(value: string) {
    let checked: boolean = false;
    this.arrayCheckboxSelec.forEach(
      (item) => {
        if (item == value) {
          checked = true;
        }
      }
    );
    return checked;
  }
  public decline() {
    if (this.arrayCheckboxSelec.length == 0) {
      this.checkArray=[]
      console.log(this.checkArray);
      this._modalService.close(this.checkArray);
    }else{
      console.log(this.arrayCheckboxSelec);
      if (this.arrayCheckboxSelec.length !== 0 && this.checkArray.length==0) {
         this.checkArray = [];
         console.log(this.checkArray);
         this._modalService.close(this.checkArray);
      }else{
        this._modalService.dismiss();
      }
    }
  }
  public dismiss(value:string) {
   this._modalService.close(this.checkArray);
  }
}
