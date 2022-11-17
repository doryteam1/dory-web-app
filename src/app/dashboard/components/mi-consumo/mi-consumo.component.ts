import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConsumidorService } from 'src/app/services/consumidor.service';
import { EspeciesService } from 'src/app/services/especies.service';
import {  Location } from '@angular/common';

@Component({
  selector: 'app-mi-consumo',
  templateUrl: './mi-consumo.component.html',
  styleUrls: ['./mi-consumo.component.scss'],
})
export class MiConsumoComponent implements OnInit, AfterViewInit {
  consumos: Array<any> = [];
  misConsumos: Array<any> = [];
  loading: boolean = false;
  year: number | null = null;
  month: number | null = null;
  edition: boolean = false;
  constructor(
    private especiesService: EspeciesService,
    private consumidorService: ConsumidorService,
    private ar: ActivatedRoute,
    private location: Location
  ) {}
  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.year = JSON.parse(this.ar.snapshot.paramMap.get('year')!);
    this.month = JSON.parse(this.ar.snapshot.paramMap.get('month')!);
    this.edition = JSON.parse(this.ar.snapshot.paramMap.get('edition')!);
    this.especiesService.getEspecies().subscribe((response) => {
      this.consumos = response.data;
      this.consumidorService
        .getMisConsumos(this.year!, this.month!)
        .subscribe((response) => {
          this.misConsumos = response.data;
          this.consumos.forEach((consumo) => {
            let index = this.misConsumos.findIndex((miconsumo) => {
              return miconsumo.id_especie == consumo.id_especie;
            });
            if (index !== -1) {
              consumo.cantidad_consumo =
                this.misConsumos[index].cantidad_consumo;
              consumo.check = true;
            } else {
              consumo.cantidad_consumo = 0;
              consumo.check = false;
            }
          });
        });
    });
  }

  updateConsumo() {
    this.loading = true;
    console.log(this.consumos);
    let consumosFiltered = this.consumos.filter((consumo) => {
      return consumo.check;
    });
    this.consumidorService
      .updateConsumo(consumosFiltered, this.year!, this.month!)
      .subscribe(
        (response) => {
          this.loading = false;
          this.goBack()
          console.log(response);
        },
        (err) => {
          this.loading = false;
           this.goBack();
          console.log(err);
        }
      );
  }

  onCheck(consumo: any, event: any, idEspecie: string) {
    let input = document.getElementById(idEspecie);
    if (event.target === input) return;
    consumo.check = !consumo.check;
  }

  onChange(consumo: any, value: number) {
    if (value > 0) {
      consumo.check = true;
    } else {
      consumo.check = false;
    }
  }

  test() {
    console.log('test');
  }
  goBack() {
    this.location.back();
  }
}
