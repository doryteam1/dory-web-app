import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dory-movil',
  templateUrl: './dory-movil.component.html',
  styleUrls: ['./dory-movil.component.scss'],
})
export class DoryMovilComponent implements OnInit {
  classActive: boolean = false;
  datosboton: any[] = [
    {
      title: 'Descargar',
      icon: 'assets/icons/android.svg',
      url: 'https://play.google.com/store/apps/details?id=com.app.dory',
    },
    {
      title: 'Descargar',
      icon: 'assets/icons/manual.svg',
      url: '#',
    },
    {
      title: 'Descargar',
      icon: 'assets/icons/manual.svg',
      url: 'https://ginelect.net/manual/mobile/manual-mobile-dory.pdf',
    },
  ];
  constructor() {}
  ngOnInit(): void {}
  openData() {
    if (this.classActive) {
      this.classActive = false;
    } else {
      this.classActive = true;
    }
  }
}
