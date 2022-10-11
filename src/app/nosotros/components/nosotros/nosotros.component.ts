import { Component, OnInit } from '@angular/core';
import { MisionVisionService } from 'src/app/services/mision-vision.service';

@Component({
  selector: 'app-nosotros',
  templateUrl: './nosotros.component.html',
  styleUrls: ['./nosotros.component.scss'],
})
export class NosotrosComponent implements OnInit {
  misionVision: any;
  fotoMision: any;
  fotoVision: any;
  fotoEntidad: any;
  loading:boolean=true
  constructor(private misionVisionService: MisionVisionService) {}
  ngOnInit(): void {
    this.misionVisionService.getVisionMision().subscribe(
      (response) => {
        this.loading = false;
        this.misionVision = response.data[0];
        this.fotoEntidad = this.misionVision?.imagen_entidad;
        this.fotoMision = this.misionVision?.imagen_mision;
        this.fotoVision = this.misionVision?.imagen_vision;
      },
      (err) => {
        this.loading=true
      }
    );
  }
}
