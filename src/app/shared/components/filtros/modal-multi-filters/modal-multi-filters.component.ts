import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Filtro } from 'src/models/filtro.model';

@Component({
  selector: 'app-modal-multi-filters',
  templateUrl: './modal-multi-filters.component.html',
  styleUrls: ['./modal-multi-filters.component.scss'],
})
export class ModalMultiFiltersComponent implements OnInit {
  closeResult = '';
  @Input() chipFilter1!: Filtro;
  @Input() deleteChipFilter1: any = -1;
  @Input() radioFilter1!: Filtro;
  @Input() deleteRadioFilter1: any = -1;
  @Input() shortByOptions!: Filtro;
  @Input() checkboxOptions!: any[];
  @Input() checkboxOptions_dos!: any[];
  @Input() checkArray: any[] = [];
  @Input() checkArray_dos: any[] = [];
  @Output() filtersAplied: EventEmitter<any> = new EventEmitter();
  form: FormGroup = new FormGroup({
    radioFilter1: new FormControl('-1'),
    chipFilter1: new FormControl('-1'),
  });
  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {}
  open(content: any) {
    if (this.deleteChipFilter1 == null) {
      this.form.get('chipFilter1')?.setValue(this.deleteChipFilter1);
    }
    if (this.deleteRadioFilter1 == null) {
      this.form.get('radioFilter1')?.setValue(this.deleteRadioFilter1);
    }
    for (let index = 0; index < this.checkArray.length; index++) {
      const element = this.checkArray[index];
      this.isChecked(element);
    }
    for (let index = 0; index < this.checkArray_dos.length; index++) {
      const element = this.checkArray_dos[index];
      this.isChecked_dos(element);
    }
    this.modalService
      .open(content, {
        centered: true,
        ariaLabelledBy: 'modal-basic-title',
        windowClass: 'app-custom-modal',
      })
      .result.then(
        (result: any) => {
          this.filtersAplied.emit(this.filterApply());
        },
        (reason: any) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  onchangeChipFilter1(value: number) {
    if (value == this.form.get('chipFilter1')?.value) {
      this.form.get('chipFilter1')?.setValue(-1);
      return;
    }
    this.form.get('chipFilter1')?.setValue(value);
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
  clickRadioFilter(even: any) {
    if (even == this.form.get('radioFilter1')?.value) {
      this.form.get('radioFilter1')?.setValue(-1);
    }
  }
  isChecked(value: string) {
    let checked: boolean = false;
    this.checkArray.forEach((item) => {
      if (item == value) {
        checked = true;
      }
    });
    return checked;
  }

  onCheckboxChange_dos(e: any) {
    if (e.target.checked) {
      this.checkArray_dos.push(e.target.value);
    } else {
      let i: number = 0;
      this.checkArray_dos.forEach((item, i: number) => {
        if (item == e.target.value) {
          this.checkArray_dos.splice(i, 1);
          return;
        }
        i++;
      });
    }
  }

  isChecked_dos(value: string) {
    let checked: boolean = false;
    this.checkArray_dos.forEach((item) => {
      if (item == value) {
        checked = true;
      }
    });
    return checked;
  }

  filterApply() {
    let radioFilter1Index = this.radioFilter1
      ? this.radioFilter1.data.findIndex(
          (element) => element.id == this.form.get('radioFilter1')?.value
        )
      : -1;
    let chipFilter1Index = this.chipFilter1
      ? this.chipFilter1.data.findIndex(
          (element) => element.id == this.form.get('chipFilter1')?.value
        )
      : -1;
    let filters = {
      radioFilter1:
        radioFilter1Index > -1
          ? this.radioFilter1.data[radioFilter1Index]
          : null,
      chipFilter1:
        chipFilter1Index > -1 ? this.chipFilter1.data[chipFilter1Index] : null,
      selectedCheckboxs: this.checkArray.slice(),
      selectedCheckboxs_dos: this.checkArray_dos.slice(),
    };
    return filters;
  }
}
