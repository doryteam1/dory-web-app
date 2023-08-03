import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GranjasService } from 'src/app/granjas/services/granjas.service';
import { textChangeRangeIsUnchanged } from 'typescript';

@Component({
  selector: 'app-resenas-modal-content',
  templateUrl: './resenas-modal-content.component.html',
  styleUrls: ['./resenas-modal-content.component.scss']
})
export class ResenasModalContentComponent implements OnInit {
  @Input() title: string = 'Confirmar acción';
  @Input() btnCancelText: string = 'Cerrar';
  @Input() granjaId: number = -1;
  resenas:any = [];
  puntuacion:number = -1;
  showNotFound:boolean = false;
  showErrorFound:boolean = false;
  constructor(private _modalService: NgbActiveModal, private granjasService:GranjasService) { }

  ngOnInit(): void {
    this.granjasService.resenasById(this.granjaId).subscribe(
      (response)=>{
        this.resenas = response.data.resenas;
        this.puntuacion = response.data.puntaje;
        if(this.resenas.length < 1){
          this.showNotFound = true;
        }else{
          this.showNotFound = false;
        }
      },err=>{
        this.showNotFound = false;
        this.showErrorFound = true;
        console.log(err)
      }
    )
  }

  ngAfterViewInit() {
  }

  public decline(){
    this._modalService.close(false)
  }

  public accept(){
    this._modalService.close(true)
  }

  public dismiss(){
    this._modalService.dismiss()
  }
}
