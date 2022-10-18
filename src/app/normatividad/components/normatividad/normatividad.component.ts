import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NormatividadService } from 'src/app/services/normatividad.service';
import { SearchBuscadorService } from 'src/app/shared/services/search-buscador.service';
import { BuscarPor } from 'src/models/buscarPor.model';

@Component({
  selector: 'app-normatividad',
  templateUrl: './normatividad.component.html',
  styleUrls: ['./normatividad.component.scss'],
})
export class NormatividadComponent implements OnInit {
  normatividades: any[] = [];
  norma: any;
  showError: boolean = false;
  showNotFound: boolean = false;
  /* normatividadesFiltered: Array<Normatividad> = []; */
  normatividadesArray: any[] = [];
  palabra: string = '';
  constructor(
    private activatedRoute: ActivatedRoute,
    private nService: NormatividadService,
    private searchBuscadorService: SearchBuscadorService,
    public _router: Router
  ) {}

  ngOnInit(): void {
    this.cargaService();
  }
  cargaService() {
    this.nService.getNormatividadesAll().subscribe(
      (response) => {
        if (response.data.length > 0) {
          this.normatividades = response.data;
          this.normatividadesArray = this.normatividades.filter((value) => {
            if (this.activatedRoute.snapshot.url[0].path == 'resoluciones') {
              return value.tipo == 'Resolución';
            }
            if (this.activatedRoute.snapshot.url[0].path == 'leyes') {
              return value.tipo == 'Ley';
            }
            if (this.activatedRoute.snapshot.url[0].path == 'decretos') {
              return value.tipo == 'Decreto';
            }
            return (
              value.tipo ==
              this.activatedRoute.snapshot.url[0].path.substring(
                0,
                this.activatedRoute.snapshot.url[0].path.length - 1
              )
            );
          });
          this.showError = false;
          this.showNotFound = false;
        } else {
          this.showNotFound = true;
          this.showError = false;
        }
      },
      (err) => {
        console.log(err);
        this.showNotFound = false;
        this.showError = true;
      }
    );
  }

  buscarData(texto: string): any {
    let normasresult: any[];
    if (texto.trim().length === 0) {
      normasresult = this.normatividades;
    } else {
      let buscardatospor: BuscarPor[] = [
        { data1: 'tipo' },
        { data2: 'nombre' },
        { data3: 'contenido' },
        { data4: 'municipio' },
      ];
      normasresult = this.searchBuscadorService.buscarData(
        this.normatividadesArray,
        texto,
        buscardatospor
      );
    }
    return normasresult;
  }
  onBuscarPalabra(palabra: string) {
    this.palabra = palabra;
    this.reseteoDeBusqueda();
  }
  reseteoDeBusqueda() {
    let resultados: any[] = this.buscarData(this.palabra);
    this.normatividadesArray = resultados;
  }
}
