import { Component, OnInit } from '@angular/core';
import { GranjasService } from '../../services/granjas.service';

@Component({
  selector: 'app-granja-detalle',
  templateUrl: './granja-detalle.component.html',
  styleUrls: ['./granja-detalle.component.scss']
})
export class GranjaDetalleComponent implements OnInit {
  granja:any;

  constructor(private granjasService:GranjasService) { }

  ngOnInit(): void {
    this.granjasService.getGranja(3).subscribe(
      (response)=>{
        if(response.data.length > 0){
          this.granja = response.data[0];
          console.log("granja ",this.granja);
        }
      }
    );
  }

}
