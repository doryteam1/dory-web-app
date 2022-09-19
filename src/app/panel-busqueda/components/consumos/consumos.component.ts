import { Component, OnInit } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConsumidorService } from 'src/app/services/consumidor.service';
@Component({
  selector: 'app-consumos',
  templateUrl: './consumos.component.html',
  styleUrls: ['./consumos.component.scss']
})
export class ConsumosComponent implements OnInit {
  loading:boolean = false;
  configChartArray:any[] = [];
  consumosMunic:Array<any> = [];
  public doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: false,
  };

  constructor(private consumidorService:ConsumidorService,private spinner: NgxSpinnerService) {}
  ngOnInit(): void {
    this.loading = true;
    this.consumidorService.getConsumosMunicipios().subscribe(
      (response)=>{
        this.consumosMunic = response.data;
        this.poblateDoughnutChartDatasetArray();
        this.loading = false;
      },err=>{
        this.loading = false;
      }
    )
  }

  poblateDoughnutChartDatasetArray(){
    for(let i=0; i < this.consumosMunic.length; i++){
      let doughnutChartDatasets: ChartConfiguration<'doughnut'>['data']['datasets'] =
      [{ data: [], label: 'Series A' }];
      // Doughnut
      let doughnutChartLabels: string[] = [
      ];
      let consumo = this.consumosMunic[i].consumo;
      let totalConsum = 0;
      for(let j=0; j<consumo.length; j++){
        doughnutChartLabels.push(consumo[j].especie);
        doughnutChartDatasets[0].data.push(consumo[j].consumo);
        totalConsum += consumo[j].consumo;
      }
      this.configChartArray.push({
        municipio:this.consumosMunic[i].municipio,
        doughnutChartLabels:doughnutChartLabels,
        doughnutChartDatasets:doughnutChartDatasets,
        consumoTotal:totalConsum
      })
    }
  }
}
