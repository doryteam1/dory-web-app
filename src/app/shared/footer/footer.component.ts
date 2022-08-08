import { Component, OnInit } from '@angular/core';
import { ElectronjsService } from 'src/app/services/electronjs.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  constructor(private electronjsService: ElectronjsService) {}
 electronActivado:boolean=false
  ngOnInit(): void {
     this.electronActivado=this.electronjsService.ipcActivo;
  }
}
