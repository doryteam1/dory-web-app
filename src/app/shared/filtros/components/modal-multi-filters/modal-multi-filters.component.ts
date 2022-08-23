import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Checkbox } from 'src/models/checkbox.model';
import { Filtro } from 'src/models/filtro.model';

@Component({
  selector: 'app-modal-multi-filters',
  templateUrl: './modal-multi-filters.component.html',
  styleUrls: ['./modal-multi-filters.component.scss']
})
export class ModalMultiFiltersComponent implements OnInit {
  closeResult = '';
  @Input() chipFilter1!:Filtro;
  @Input() radioFilter1!:Filtro;
  @Input() shortByOptions!:Filtro;
  @Input() checkboxOptions!:any[];
  @Input() checkArray: any[] = [];
  @Output() filtersAplied: EventEmitter<any> = new EventEmitter();
  form:FormGroup = new FormGroup({
    radioFilter1: new FormControl('-1'),
    chipFilter1: new FormControl('-1')
  })
  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  open(content:any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result:any) => {
      this.filtersAplied.emit(this.filterApply())
    }, (reason:any) => {
      console.log("reason ",reason)
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
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

  onchangeChipFilter1(value:number){
    this.form.get('chipFilter1')?.setValue(value)
  }

  onCheckboxChange(e: any) {
    if (e.target.checked) {
      console.log(e.target.value)
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
    this.checkArray.forEach(
      (item) => {
        if (item == value) {
          checked = true;
        }
      }
    );
    return checked;
  }

  filterApply(){
    let radioFilter1Index = this.radioFilter1.data.findIndex((element)=> element.id == this.form.get('radioFilter1')?.value)
    let chipFilter1Index = this.chipFilter1.data.findIndex((element)=> element.id == this.form.get('chipFilter1')?.value)
    let filters = {
      "radioFilter1" : radioFilter1Index > -1 ? this.radioFilter1.data[radioFilter1Index] : null,
      "chipFilter1" : chipFilter1Index > -1 ? this.chipFilter1.data[chipFilter1Index] : null,
      "selectedCheckboxs" : this.checkArray
    };
    return filters;
  }
}
