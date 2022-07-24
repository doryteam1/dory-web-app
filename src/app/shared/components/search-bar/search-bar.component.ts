import { Component, HostBinding, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {
  @HostBinding('hidden')
  isHidden:boolean = false;
  constructor(private router:Router) { }

  ngOnInit(): void {
    this.router.events.subscribe(
      (event)=>{
        if(event instanceof NavigationEnd){
          console.log(event)
          let route:string = event.url;
          if(route.includes('dashboard') 
          || route.includes('contacto') 
          || route.includes('update-password') 
          || route.includes('update-password')
          || route.includes('login')
          || route.includes('registro')){
            this.isHidden = true;
          }else{
            this.isHidden = false;
          }
        }
      }
    )
  }

}
