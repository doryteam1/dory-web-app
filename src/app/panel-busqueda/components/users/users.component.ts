import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MODO_FILTRO_DATOS_VARIOS } from 'src/app/global/constants';
import { PescadoresService } from 'src/app/pescadores/services/pescadores.service';
import { PiscicultoresService } from 'src/app/piscicultores/services/piscicultores.service';
import { InvestigadorService } from 'src/app/services/investigador.service';
import { PlacesService } from 'src/app/services/places.service';
import { ProveedorService } from 'src/app/services/proveedor.service';
import { NegociosService } from 'src/app/services/negocios.service';
import { TransportadoresService } from 'src/app/services/transportadores.service';
import { SearchBuscadorService } from 'src/app/shared/services/search-buscador.service';
import { Utilities } from 'src/app/utilities/utilities';
import { BuscarPor } from 'src/models/buscarPor.model';
import { Checkbox } from 'src/models/checkbox.model';
import { MetaFiltro } from 'src/models/filtro.model';
import { ConsumidorService } from 'src/app/services/consumidor.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  usersFiltered!: any[];
  filtroseleccionadoCheckbox: string[] = [];
  filtroseleccionado!: MetaFiltro | any;
  palabra: string = '';
  users!: any[];
  locations: Array<any> = [];
  showNotFound: boolean = false;
  authUserId: number = -1;
  authRol: string = '';
  electronActive: any = window.require; //verificar la disponibilidad, solo esta disponible en electronJS;
  checkbox: Checkbox[] = [
    {
      nameButton: 'Municipios',
      nombrecampoDB: 'municipio',
      modoFiltro: MODO_FILTRO_DATOS_VARIOS,
      titulomodal: 'Municipios de sucre',
    },
    /* modoFiltro: 'number_ordenarmayoramenor', */
  ];
  userType: string = '';
  resultFiltroPorMunicipio: any[] = [];
  informacionP: string = '';
  tiuloh4: string = '';
  constructor(
    private pescadoresService: PescadoresService,
    private piscicultoresService: PiscicultoresService,
    private proveedoresService: ProveedorService,
    private investigadoresServices: InvestigadorService,
    private negociosService: NegociosService,
    private transportadoresService: TransportadoresService,
    private router: Router,
    private searchBuscadorService: SearchBuscadorService,
    private consumidorService: ConsumidorService,
    private places: PlacesService,
    private ar: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userType = this.ar.snapshot.url[0].path!;
    let token = localStorage.getItem('token');
    if (token) {
      let payload = Utilities.parseJwt(token!);
      this.authUserId = payload.sub;
      this.authRol = payload.rol;
    }

    /*Todas las usuarios que existen de un tipo determinado*/
    this.getUsers()!.subscribe((response: any) => {
      this.users = response.data;
      this.usersFiltered = this.users.slice();
      if (this.usersFiltered.length < 1) {
        this.showNotFound = true;
      } else {
        this.showNotFound = false;
      }
    });
    /* municipios sucre */
    if (this.userType == 'proveedores') {
      this.checkbox = [
        {
          nameButton: 'Departamentos',
          nombrecampoDB: 'departamento',
          modoFiltro: MODO_FILTRO_DATOS_VARIOS,
          titulomodal: 'Departamentos de Colombia',
        },
        /* modoFiltro: 'number_ordenarmayoramenor', */
      ];
      this.loadDptos();
    } else {
      this.loadMunic();
    }
  }
  getUsers(): Observable<any> | null {
    if (this.userType == 'pescadores') {
      this.informacionP =
        'En esta sección, encontrarás información sobre los pescadores registrados en nuestra aplicación DORY que hacen parte de las actividades del sector piscícola, lo cual puede resultar de gran ayuda para la identificación y el seguimiento de los actores clave en la producción de peces.';
      this.tiuloh4 = 'Pescadores';
      return this.pescadoresService.getPescadores();
    } else if (this.userType == 'piscicultores') {
      this.informacionP =
        'En esta sección, encontrarás información sobre los piscicultores registrados en la plataforma DORY que hacen parte de las actividades del sector piscícola, lo cual puede resultar de gran ayuda para la identificación y el seguimiento de los actores clave en la producción de peces.';
      this.tiuloh4 = 'Piscicultores';
      return this.piscicultoresService.getPiscicultores();
    } else if (this.userType == 'investigadores') {
      this.informacionP =
        'En esta sección, encontrarás información sobre los investigadores que hacen parte del sector piscícola, lo cual puede resultar útil para la identificación de expertos y contactarlos para obtener información valiosa sobre el sector.';
      this.tiuloh4 = 'Investigadores';
      return this.investigadoresServices.getInvestigadoresAll();
    } else if (this.userType == 'proveedores') {
      this.informacionP =
        'En esta sección, encontrarás información sobre los proveedores destinados a prestar servicios relacionados con el sector piscícola, lo cual puede resultar de gran ayuda para la identificación y poder tener contactar con estos actores.';
      this.tiuloh4 = 'Proveedores';
      return this.proveedoresService.getProveedoresAll();
    } else if (this.userType == 'transportadores') {
      this.informacionP =
        'En esta sección, encontrarás información sobre los transportadores destinados a prestar servicios relacionados con el sector piscícola, lo cual puede resultar de gran ayuda para poder contactarlos.';
      this.tiuloh4 = 'Transportadores';
      return this.transportadoresService.getTransportadoresAll();
    } else if (this.userType == 'comerciantes') {
      this.informacionP =
        'En esta sección, encontrarás información sobre los comerciantes que hacen parte del sector piscícola, lo cual puede resultar útil para la identificación de los actores clave en la cadena de suministro de la producción de peces.';
      this.tiuloh4 = 'Comerciantes';
      return this.negociosService.getComerciantesAll();
    } else if (this.userType == 'consumidores') {
      this.informacionP =
        'En esta sección, encontrarás información sobre los consumidores que hacen parte del sector piscícola, lo cual puede resultar útil para la identificación de los actores clave en la cadena de suministro de la producción de peces.';
      this.tiuloh4 = 'Consumidores';
      return this.consumidorService.getConsumidoresAll();
    }
    return null;
  }

  goDetail(user: any) {
    const map: any = {
      Pescador: '/pescadores/municipio/detalle/',
      Piscicultor: '/piscicultores/municipio/detalle/',
      Proveedor: '/proveedores/detalle/',
      'Investigador Experto': '/investigadores/detalle/',
      Transportador: '/transportadores/detalle/',
      Comerciante: '/comerciantes/detalle/',
      Consumidor: '/consumidores/detalle/',
    };
    const baseUrl: string = map[user.tipo_usuario] ?? '';
    this.router.navigateByUrl(baseUrl + `${user.id}`);
  }
  deleteFilterCheckbox(index: number) {
    this.filtroseleccionadoCheckbox.splice(index, 1);
    this.searchReset();
  }

  searchReset() {
    let resultados: any[] = this.buscarData(this.palabra);
    if (
      this.filtroseleccionadoCheckbox &&
      this.filtroseleccionadoCheckbox.length > 0
    ) {
      resultados = this.filtradoDataCheckbox(
        this.filtroseleccionadoCheckbox,
        resultados
      );
      let filterBy = 'municipio';
      if (this.userType == 'proveedores') {
        filterBy = 'departamento';
      }
      this.resultFiltroPorMunicipio = this.searchBuscadorService.filterEspecial(
        resultados,
        this.filtroseleccionadoCheckbox,
        filterBy
      );
    }
    this.usersFiltered = resultados;
    if (this.usersFiltered.length < 1) {
      this.showNotFound = true;
    } else {
      this.showNotFound = false;
    }
  }

  filtradoData(filtroSelecOptionData: MetaFiltro, arrayafiltar: any[]) {
    let filtroresult: any[] = [];
    filtroresult = this.searchBuscadorService.filterSeleccionadoList(
      arrayafiltar,
      filtroSelecOptionData
    );
    return filtroresult;
  }

  filtradoDataCheckbox(arrayCheckboxSelec: any[], arrayafiltrar: any[]) {
    let filtroresult: any[] = [];
    let filtroSelecOptionData: Checkbox[] = this.checkbox;
    filtroresult = this.searchBuscadorService.filterCheckbox(
      arrayafiltrar,
      arrayCheckboxSelec,
      filtroSelecOptionData
    );
    return filtroresult;
  }

  onBuscarPalabra(palabra: string) {
    this.palabra = palabra;
    this.searchReset();
  }

  buscarData(texto: string): any {
    let result: any[];
    if (texto.trim().length === 0) {
      result = this.users;
    } else {
      if (this.userType == 'consumidores') {
        let buscardatospor: BuscarPor[] = [{ data1: 'nombre_completo' }];
        result = this.searchBuscadorService.buscarData(
          this.users,
          texto,
          buscardatospor
        );
      } else {
        let buscardatospor: BuscarPor[] = [{ data1: 'nombre' }];
        result = this.searchBuscadorService.buscarData(
          this.users,
          texto,
          buscardatospor
        );
      }
    }
    return result;
  }

  deleteFilter() {
    this.filtroseleccionado = null;
    this.searchReset();
  }

  onFiltroChangeCheckbox(checkboxs: string[]) {
    if (checkboxs.length == 0) {
      this.filtroseleccionadoCheckbox = [];
      this.resultFiltroPorMunicipio = [];
    } else {
      this.filtroseleccionadoCheckbox = checkboxs;
    }
    this.searchReset();
  }

  onFiltroChange(filtro: MetaFiltro) {
    this.filtroseleccionado = filtro;
    this.searchReset();
  }

  loadMunic(): any[] {
    this.places.getMunicipiosDepartamentos(70).subscribe(
      (response) => {
        this.locations = response.data;
      },
      (err) => {
        console.log(err);
      }
    );
    return this.locations;
  }

  loadDptos() {
    this.places.getDepartamentos().subscribe(
      (response) => {
        this.locations = response.data;
        this.locations = this.locations.map((location) => {
          return {
            id: location.id_departamento,
            nombre: location.nombre_departamento,
          };
        });
      },
      (err) => {
        console.log(err);
      }
    );
    return this.locations;
  }
}
