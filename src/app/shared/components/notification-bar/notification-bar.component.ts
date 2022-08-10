import { Component, HostBinding, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-notification-bar',
  templateUrl: './notification-bar.component.html',
  styleUrls: ['./notification-bar.component.scss']
})
export class NotificationBarComponent implements OnInit {
  hasAlert:boolean = true;
  @HostBinding('hidden')
  isHidden:boolean = false;
  constructor(private router:Router) { }

  ngOnInit(): void {
    this.router.events.subscribe(
      (event)=>{
        if(event instanceof NavigationEnd){
          let route:string = event.url;
          if(route.includes('dashboard')
          || route.includes('contacto')
          || route.includes('update-password')
          || route.includes('update-password')
          || route.includes('login')
          || route.includes('registro')
          || route.includes('pescadores')
          || route.includes('granjas')
          || route.includes('piscicultores')){
            this.isHidden = true;
          }else{
            this.isHidden = false;
          }
        }
      }
    )
  }

  changeAlertState(){
    this.hasAlert = !this.hasAlert;
  }
}
