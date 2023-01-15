import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  baseUrl: string = environment.thisWebUrl;
  electronActive: any = window.require; //verificar la disponibilidad, solo esta disponible en electronJS;
  constructor(private router: Router) {}

  ngOnInit(): void {}
  navigate(ruta: any) {
    this.router.navigateByUrl(`${ruta}`);
  /*   if (this.electronActive) {
      this.router.navigateByUrl(`${ruta}`);
    } else {
      let url = '';
      url = this.router.serializeUrl(this.router.createUrlTree([ruta]));
      window.open(url, '_blank');
    } */
  }
  
}
