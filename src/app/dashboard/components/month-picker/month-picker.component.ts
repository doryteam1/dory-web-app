import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as dayjs from 'dayjs';
import { Utilities } from 'src/app/utilities/utilities';

@Component({
  selector: 'app-month-picker',
  templateUrl: './month-picker.component.html',
  styleUrls: ['./month-picker.component.scss']
})
export class MonthPickerComponent implements OnInit {
  dates:dayjs.Dayjs[] = [];
  //startDate:dayjs.Dayjs = dayjs('2022-11-1');
  startDate:dayjs.Dayjs = dayjs('2019-11-1');
  constructor(private router:Router) { }

  ngOnInit(): void {
    let now = dayjs();
    this.dates.push(this.startDate);
    let lastDate = this.startDate;
    while(Utilities.isMinor(lastDate,now)){
      this.dates.push(lastDate.add(1,'month'));
      lastDate = this.dates[this.dates.length-1];
    }
  }

  getMonthName(monthName:number){
    return Utilities.getMonthName(monthName)
  }

  navigateTo(date:dayjs.Dayjs){
    this.router.navigate(['/dashboard/form-consumo',{year:date.year(),month:date.month()+1}])
  }
}
