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
  normatividadesArray: any[] = [];
  normatividadesArrayCopy: any[] = [];
  normatividadesArrayLength: boolean = false;
  showError: boolean = false;
  showNotFound: boolean = false;
  norma: any;
  palabra: string = '';
  filters: any[] = [
    { label: 'Leyes', route: '/normatividad/leyes' },
    { label: 'Decretos', route: '/normatividad/decretos' },
    { label: 'Resoluciones', route: '/normatividad/resoluciones' },
  ];
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
    this.showError = false;
    this.showNotFound = false;
    this.normatividadesArray = [];
    this.normatividadesArrayCopy = [];
    this.nService.getNormatividadesAll().subscribe(
      (response) => {
        if (response.data.length > 0) {
          /* Este código está asignando un valor a la variable
          "tipoFiltro" dependiendo del valor de la ruta activa.
           Está usando el operador ternario para evaluar si
            la ruta es "resoluciones", "leyes" o "decretos".
            Si es alguna de estas tres, se asignará el
            valor correspondiente ("Resolución", "Ley" o "Decreto").
             Si no es ninguna de ellas, se asignará un substring
             del valor de la ruta activa sin el último caracter. */
          const tipoFiltro =
            this.activatedRoute.snapshot.url[0].path == 'resoluciones'
              ? 'Resolución'
              : this.activatedRoute.snapshot.url[0].path == 'leyes'
              ? 'Ley'
              : (this.activatedRoute.snapshot.url[0].path == 'decretos'
                  ? 'Decreto'
                  : this.activatedRoute.snapshot.url[0].path
                ).substring(
                  0,
                  this.activatedRoute.snapshot.url[0].path.length - 1
                );

          this.normatividadesArray = response.data.filter(
            (value: any) => value.tipo == tipoFiltro
          );
          this.normatividadesArrayCopy = this.normatividadesArray;
          this.normatividadesArrayLength = Boolean(
            this.normatividadesArray.length <= 0
          );
        } else {
          this.showNotFound = true;
          this.showError = false;
        }
      },
      (err) => {
        this.showNotFound = false;
        this.showError = true;
      }
    );
  }

  buscarData(texto: string): any {
    if (texto.trim().length === 0) {
      return this.normatividadesArrayCopy;
    }
    const buscardatospor: BuscarPor[] = [
      { data1: 'nombre' },
      { data2: 'contenido' },
    ];
    return this.searchBuscadorService.buscarData(
      this.normatividadesArrayCopy,
      texto,
      buscardatospor
    );
  }
  onBuscarPalabra(palabra: string) {
    this.palabra = palabra;
    this.reseteoDeBusqueda();
  }
  reseteoDeBusqueda() {
    let resultados: any[] = this.buscarData(this.palabra);
    this.normatividadesArray = resultados;
    this.showNotFound = this.normatividadesArray.length < 1 ? true : false;
  }
}
