import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { MODO_FILTRO_DATOS_VARIOS } from 'src/app/global/constants';
import { PescadoresService } from 'src/app/pescadores/services/pescadores.service';
import { PiscicultoresService } from 'src/app/piscicultores/services/piscicultores.service';
import { InvestigadorService } from 'src/app/services/investigador.service';
import { MediaQueryService } from 'src/app/services/media-query.service';
import { PlacesService } from 'src/app/services/places.service';
import { ProveedorService } from 'src/app/services/proveedor.service';
import { NegociosService } from 'src/app/services/negocios.service';
import { TransportadoresService } from 'src/app/services/transportadores.service';
import { AppModalService } from 'src/app/shared/services/app-modal.service';
import { SearchBuscadorService } from 'src/app/shared/services/search-buscador.service';
import { Utilities } from 'src/app/utilities/utilities';
import { BuscarPor } from 'src/models/buscarPor.model';
import { Checkbox } from 'src/models/checkbox.model';
import { MetaFiltro } from 'src/models/filtro.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit, OnDestroy {
  usersFiltered!: any[];
  filtroseleccionadoCheckbox: string[] = [];
  filtroseleccionado!: MetaFiltro | any;
  palabra: string = '';
  users!: any[];
  locations: Array<any> = [];
  showNotFound: boolean = false;
  authUserId: number = -1;
  authRol: string = '';
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
  shorterNumber: number = 20;
  mediaQueryUser!: Subscription;
  ngOnDestroy(): void {
    this.mediaQueryUser.unsubscribe();
  }
  constructor(
    private pescadoresService: PescadoresService,
    private piscicultoresService: PiscicultoresService,
    private proveedoresService: ProveedorService,
    private investigadoresServices: InvestigadorService,
    private negociosService: NegociosService,
    private transportadoresService: TransportadoresService,
    private router: Router,
    private searchBuscadorService: SearchBuscadorService,
    private places: PlacesService,
    private ar: ActivatedRoute,
    public mediaQueryService: MediaQueryService,
    private appModalService: AppModalService
  ) {}

  ngOnInit(): void {
    this.userType = this.ar.snapshot.url[0].path!;
    console.log('userType ', this.userType);
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
      console.log(this.usersFiltered);
      if (this.usersFiltered.length < 1) {
        this.showNotFound = true;
      } else {
        this.showNotFound = false;
      }
    });
    this.mediaQueryUser = this.mediaQueryService
      .mediaQuery('max-width: 300px')
      .subscribe((matches) => {
        if (matches) {
          this.shorterNumber = 15;
        } else {
          this.shorterNumber = 20;
        }
      });
    /* municipios sucre */
    if(this.userType == 'proveedores'){
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
    }else{
      this.loadMunic();
    }
  }
  datosContactoUser(user: any) {
    let object: any;
    if (user.tipo_usuario == 'Pescador') {
      object = {
        nombreUser: user.nombre,
        tipoUser: user.tipo_usuario,
        foto: user.foto,
        correoUser: user.email,
        telefonoUser: user.celular,
        rutaUserDetalle: `/pescadores/detalle/${user.id}`,
      };
    } else if (user.tipo_usuario == 'Piscicultor') {
      object = {
        nombreUser: user.nombre,
        tipoUser: user.tipo_usuario,
        foto: user.foto,
        correoUser: user.email,
        telefonoUser: user.celular,
        rutaUserDetalle: `/piscicultores/municipio/detalle/${user.id}`,
      };
    } else if (user.tipo_usuario == 'Proveedor') {
      object = {
        nombreUser: user.nombre,
        tipoUser: user.tipo_usuario,
        foto: user.foto,
        correoUser: user.email,
        telefonoUser: user.celular,
        rutaUserDetalle: `/proveedores/detalle/${user.id}`,
      };
    } else if (user.tipo_usuario == 'Investigador Experto') {
      object = {
        nombreUser: user.nombre,
        tipoUser: user.tipo_usuario,
        foto: user.foto,
        correoUser: user.email,
        telefonoUser: user.celular,
        rutaUserDetalle: `/investigadores/detalle/${user.id}`,
      };
    } else if (user.tipo_usuario == 'Transportador') {
      object = {
        nombreUser: user.nombre,
        tipoUser: user.tipo_usuario,
        foto: user.foto,
        correoUser: user.email,
        telefonoUser: user.celular,
        rutaUserDetalle: `/transportadores/detalle/${user.id}`,
      };
    } else if (user.tipo_usuario == 'Comerciante') {
      object = {
        nombreUser: user.nombre_completo,
        tipoUser: user.tipo_usuario,
        foto: user.foto,
        correoUser: user.email,
        telefonoUser: user.celular,
        rutaUserDetalle: `/comerciantes/detalle/${user.id}`,
      };
    }
    this.appModalService
      .modalContactCardComponent(object)
      .then((result) => {})
      .catch((result) => {});
  }
  getUsers(): Observable<any> | null {
    if (this.userType == 'pescadores') {
      console.log('entro por pescadores');
      return this.pescadoresService.getPescadores();
    } else if (this.userType == 'piscicultores') {
      console.log('entro por piscicultores');
      return this.piscicultoresService.getPiscicultores();
    } else if (this.userType == 'investigadores') {
      return this.investigadoresServices.getInvestigadoresAll();
    } else if (this.userType == 'proveedores') {
      return this.proveedoresService.getProveedoresAll();
    } else if (this.userType == 'transportadores') {
      return this.transportadoresService.getTransportadoresAll();
    } else if (this.userType == 'comerciantes') {
      return this.negociosService.getComerciantesAll();
    }
    return null;
  }

  goDetail(user: any) {
    let baseUrl = '';
    if (user.tipo_usuario == 'Pescador') {
      baseUrl = '/pescadores/municipio/detalle/';
    } else if (user.tipo_usuario == 'Piscicultor') {
      baseUrl = '/piscicultores/municipio/detalle/';
    } else if (user.tipo_usuario == 'Proveedor') {
      baseUrl = '/proveedores/detalle/';
    } else if (user.tipo_usuario == 'Investigador Experto') {
      baseUrl = '/investigadores/detalle/';
    } else if (user.tipo_usuario == 'Transportador') {
      baseUrl = '/transportadores/detalle/';
    } else if (user.tipo_usuario == 'Comerciante') {
      baseUrl = '/comerciantes/detalle/';
    }
    let url = this.router.serializeUrl(
      this.router.createUrlTree([baseUrl + `${user.id}`])
    );
    window.open(url, '_blank');
  }

  deleteFilterCheckbox(index: number) {
    this.filtroseleccionadoCheckbox.splice(index, 1);
    console.log(this.filtroseleccionadoCheckbox);
    this.searchReset();
  }

  searchReset() {
    let resultados: any[] = this.buscarData(this.palabra);
    /* if (this.filtroseleccionado) {
      resultados = this.filtradoData(this.filtroseleccionado, resultados);
    } */
    if (
      this.filtroseleccionadoCheckbox &&
      this.filtroseleccionadoCheckbox.length > 0
    ) {
      resultados = this.filtradoDataCheckbox(
        this.filtroseleccionadoCheckbox,
        resultados
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
      let buscardatospor: BuscarPor[] = [{ data1: 'nombre' }];
      result = this.searchBuscadorService.buscarData(
        this.users,
        texto,
        buscardatospor
      );
    }
    return result;
  }

  deleteFilter() {
    this.filtroseleccionado = null;
    this.searchReset();
  }

  onFiltroChangeCheckbox(checkboxs: string[]) {
    this.filtroseleccionadoCheckbox = checkboxs;
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

  loadDptos(){
    this.places.getDepartamentos().subscribe(
      (response) => {
        this.locations = response.data;
        this.locations = this.locations.map((location)=>{
          return {
            id:location.id_departamento,
            nombre:location.nombre_departamento
          }
        })
      },
      (err) => {
        console.log(err);
      }
    );
    return this.locations;
  }
}
