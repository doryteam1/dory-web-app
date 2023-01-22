import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dory-desktop',
  templateUrl: './dory-desktop.component.html',
  styleUrls: ['./dory-desktop.component.scss'],
})
export class DoryDesktopComponent implements OnInit {
  classActive: boolean = false;
  datosboton: any[] = [
    {
      title: 'Descargar',
      icon: 'assets/icons/windows.svg',
      url: 'https://ginelect.net/desktop/dory-desktop.exe',
    },
    {
      title: 'Descargar',
      icon: 'assets/icons/manual.svg',
      url: 'https://ginelect.net/guias/guia-instalacion-dory-desktop.pdf',
    },
    {
      title: 'Descargar',
      icon: 'assets/icons/manual.svg',
      url: 'https://ginelect.net/manual/desktop/manual-desktop-dory.pdf',
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
