
import {
  AfterViewInit,
  Component,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import * as dayjs from 'dayjs';
import { Utilities } from 'src/app/utilities/utilities';
import { ElementRef } from '@angular/core';
import { ConsumidorService } from 'src/app/services/consumidor.service';
import { ChartConfiguration } from 'chart.js';
declare var window: any;

@Component({
  selector: 'app-month-picker',
  templateUrl: './month-picker.component.html',
  styleUrls: ['./month-picker.component.scss'],
})
export class MonthPickerComponent implements OnInit, AfterViewInit {
  @ViewChild('carousel')
  carousel!: ElementRef<HTMLElement>;
  dates: dayjs.Dayjs[] = [];
  formModal: any;
  elementDate!: dayjs.Dayjs;
  //startDate:dayjs.Dayjs = dayjs('2022-11-1');
  startDate: dayjs.Dayjs = dayjs('2019-11-1');
  totalCosumo: number = 0;
  loading: boolean = false;
  showNotFound: boolean = false;
  doughnutChartLabels: Array<any> = [];
  activateEdition:boolean=false;
  doughnutChartDatasets: ChartConfiguration<'doughnut'>['data']['datasets'] = [
    { data: [], label: 'Series A' },
  ];
  doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
  };
  constructor(
    private router: Router,
    private renderer: Renderer2,
    private consumidorService: ConsumidorService
  ) {}
  ngAfterViewInit(): void {
    this.renderer.listen(
      this.carousel?.nativeElement,
      'slid.bs.carousel',
      (even: any) => {
        this.elementDate = this.dates[even.to];
        this.validarMeses(this.elementDate);
        this.getConsumos();
      }
    );
  }

  ngOnInit(): void {
    this.formModal = new window.bootstrap.Carousel(
      document.getElementById('carouselExampleIndicators'),
      {
        backdrop: false,
      }
    );
    let now = dayjs();
    this.dates.push(this.startDate);
    let lastDate = this.startDate;
    while (Utilities.isMinor(lastDate, now)) {
      this.dates.push(lastDate.add(1, 'month'));
      lastDate = this.dates[this.dates.length - 1];
    }
    this.elementDate = this.dates[this.dates.length - 1];
    this.validarMeses(this.elementDate);
    this.getConsumos();
  }
  Prev() {
    this.formModal.prev();
  }
  Next() {
    this.formModal.next();
  }
  getConsumos() {
    this.loading = true;
    let year = this.elementDate.year();
    let month = this.elementDate.month() + 1;
    let misConsumos: Array<any> = [];
    this.totalCosumo = 0;
    this.doughnutChartLabels = [];
    this.doughnutChartDatasets[0].data = [];
    this.showNotFound = false;
    this.consumidorService.getMisConsumos(year!, month!).subscribe(
      (response) => {
        this.loading = false;
        misConsumos = response.data;
        if (misConsumos.length > 0) {
          misConsumos.forEach((consumo) => {
            if (consumo.cantidad_consumo > 0) {
              this.doughnutChartLabels.push(consumo.nombre);
              this.doughnutChartDatasets[0].data.push(consumo.cantidad_consumo);
              this.totalCosumo += consumo.cantidad_consumo;
            }
          });
          if (this.totalCosumo == 0) {
            this.loading = false;
            this.showNotFound = true;
          }
        } else {
          this.loading = false;
          this.showNotFound = true;
        }
      },
      (err) => {
        this.loading = false;
        this.showNotFound = true;
        console.log(err);
      }
    );
  }
  getMonthName(monthName: number) {
    return Utilities.getMonthName(monthName);
  }
  validarMeses(date: dayjs.Dayjs) {
    this.activateEdition=false
    let currentMonth = dayjs().month() + 1;
    let currentYear = dayjs().year();
    let lastMonth=date.month() +1;
    let lastYear=date.year();
    if (lastMonth == currentMonth && lastYear == currentYear) {
      this.activateEdition=true
    }
  }
  navigateTo(date: dayjs.Dayjs,edition:boolean) {
    this.router.navigate([
      '/dashboard/form-consumo',
      { year: date.year(), month: date.month() + 1,edition:edition },
    ]);
  }
}
