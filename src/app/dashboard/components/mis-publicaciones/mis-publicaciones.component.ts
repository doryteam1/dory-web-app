import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
import { PublicacionesService } from 'src/app/services/publicaciones.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AppModalService } from 'src/app/shared/services/app-modal.service';

@Component({
  selector: 'app-mis-publicaciones',
  templateUrl: './mis-publicaciones.component.html',
  styleUrls: ['./mis-publicaciones.component.scss'],
})
export class MisPublicacionesComponent implements OnInit {
  publicaciones: any[] = [];
  private authUser: any;
  loading: boolean = false;
  showNotFound: boolean = false;
  showError: boolean = false;
  constructor(
    private router: Router,
    private publicacionService: PublicacionesService,
    private userService: UsuarioService,
    private storage: FirebaseStorageService,
    private appModalService: AppModalService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.authUser = this.userService.getAuthUser();
    this.publicacionService.getPublicacionesByUser(this.authUser.sub).subscribe(
      (response) => {
        this.publicaciones = response.data;
        this.loading = false;
        if (this.publicaciones.length < 1) {
          this.showNotFound = true;
        } else {
          this.showNotFound = false;
        }
      },
      (err) => {
        console.log(err);
        this.showNotFound = false;
        this.showError = true;
        this.loading = false;
      }
    );
  }

  create() {
    let object = {
      action: 'create',
      formState: 'enable',
    };
    this.router.navigate(['/dashboard/publicacion/detalle', object]);
  }

  navigate(event: any, state: string) {
    let object: any = { ...event };
    object.action = 'update';
    object.formState = state;
    this.router.navigate(['/dashboard/publicacion/detalle', object]);
  }
  deletePublicacion(id: any) {
    let index = this.publicaciones.findIndex(
      (element) => element.id_publicacion == id
    );
    let fotosArray = this.publicaciones[index].fotos;
    this.appModalService
      .confirm(
        'Eliminar publicación',
        'Esta seguro que desea eliminar la publicación',
        'Eliminar',
        'Cancelar',
        this.publicaciones[index].especie
      )
      .then((result) => {
        if (result == true) {
          this.publicacionService.deletePublicacion(id).subscribe(
            (response: any) => {
              let index = this.publicaciones.findIndex(
                (element) => element.id_publicacion == id
              );
              this.publicaciones.splice(index, 1);
              this.storage.deleteMultipleByUrls(fotosArray);
              if (this.publicaciones.length <= 0) {
                this.showNotFound = true;
              }
            },
            (err) => {
              console.log(err);
            }
          );
        }
      })
      .catch((result) => {});
  }
}
