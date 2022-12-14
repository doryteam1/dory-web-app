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
      url: '#',
    },
    {
      title: 'Descargar',
      icon: 'assets/icons/manual.svg',
      url: '#',
    },
    {
      title: 'Descargar',
      icon: 'assets/icons/manual.svg',
      url: '#',
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
