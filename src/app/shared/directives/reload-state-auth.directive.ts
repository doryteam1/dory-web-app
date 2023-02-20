import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';

@Directive({
  selector: '[appReloadStateAuth]',
})
export class ReloadStateAuthDirective {
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef,
    private userService: UsuarioService,
  ) {
    if (this.userService.isAuthenticated()) {
      this.viewContainerRef.clear();
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
    this.userService.getAuthObservable().subscribe((state) => {
      if (state == true) {
        this.viewContainerRef.clear();
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainerRef.clear();
      }
    });
  }
}
