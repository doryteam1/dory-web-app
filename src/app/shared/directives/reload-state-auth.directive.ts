import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';
import { WindowRefService } from 'ngx-guided-tour';
import { UsuarioService } from 'src/app/services/usuario.service';

@Directive({
  selector: '[appReloadStateAuth]'
})
export class ReloadStateAuthDirective {

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainerRef:ViewContainerRef,
    private userService:UsuarioService
  ) { 
    this.userService.getAuthObservable().subscribe(
      (state)=>{
        console.log("from reload directive user state auth ",state)
        if(state == true){
          this.viewContainerRef.clear();
          this.viewContainerRef.createEmbeddedView( this.templateRef );
        }
      }
    )
  }

}
