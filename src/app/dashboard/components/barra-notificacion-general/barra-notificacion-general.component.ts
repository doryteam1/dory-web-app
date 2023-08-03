import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  AngularEditorComponent,
  AngularEditorConfig,
} from '@kolkov/angular-editor';
import { TopAlertNotifyService } from 'src/app/services/top-alert-notify.service';
interface alert {
  texto: string;
  status: number;
  color: any;
}
@Component({
  selector: 'app-barra-notificacion-general',
  templateUrl: './barra-notificacion-general.component.html',
  styleUrls: ['./barra-notificacion-general.component.scss'],
})
export class BarraNotificacionGeneralComponent implements OnInit {
  @ViewChild('angualarEditor') angualarEditor!: AngularEditorComponent;
  htmlContent: any =
    '&#160;Digita aqu&#237; tu&#160;<span class="AzulDoryText"></span><span class="AzulDoryText"><b>publicaci&#243;n. <font color="#e7d508">El</font>&#160;</b><font color="#e70808">n&#250;mero de caracteres permitidos</font><b>&#160; es 200</b></span>';
  color: string = '#000000';
  onPublicar: number = 0;
  buttonPublicar:boolean=false
  publicacion!: alert;
  config: AngularEditorConfig = {
    editable: false,
    spellcheck: true,
    showToolbar: false,
    // enableToolbar:false,
  };
  constructor(
    private topAlertNotifyService: TopAlertNotifyService,
    private router: Router
  ) {
    /*   */
  }

  ngOnInit(): void {
    this.cargaService();
  }
  cargaService() {
    this.topAlertNotifyService.getTopAlert().subscribe(
      (response) => {
        if (response.data.length > 0) {
          this.publicacion = response.data[0];
          this.onPublicar = this.publicacion.status;
          if (this.publicacion.texto) {
            this.htmlContent = this.publicacion.texto;
            this.buttonPublicar=true
          }
          if (this.publicacion.color) {
            this.color = this.publicacion.color;
          }
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  updatePublic() {
    let object: any = {
      id: 0,
    };
    this.router.navigate([
      '/dashboard/barra-notificacion-general-admi/detalle',
      object,
    ]);
  }
  publicar() {
    if (this.onPublicar == 1) {
      this.onPublicar = 0;
      this.savePublic()
    } else if (this.onPublicar == 0) {
      this.onPublicar = 1;
      this.savePublic();
    }
  }
  savePublic() {
    let newAlert:any = {
      status: this.onPublicar,
    };
    this.topAlertNotifyService.updateParcialTopAlert(newAlert).subscribe(
      (response) => {
        this.cargaService();
      },
      (err) => {
        console.log(err);
        this.cargaService();
      }
    );
  }
}
