import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Location } from '@angular/common';
import { ElectronjsService } from 'src/app/services/electronjs.service';
@Component({
  selector: 'app-floatin-btns-alante-atras',
  templateUrl: './floatin-btns-alante-atras.component.html',
  styleUrls: ['./floatin-btns-alante-atras.component.scss'],
})
export class FloatinBtnsAlanteAtrasComponent implements OnInit, OnDestroy {
  @Output() onBotonAtrasAlante: EventEmitter<boolean> = new EventEmitter();
  BotonAtrasAlante: boolean = false;
  constructor(
    private cdRef: ChangeDetectorRef,
    private location: Location,
    private _electronService: ElectronjsService
  ) {}
  ngOnInit(): void {
    this.activatebutton();
  }
  activatebutton = (): void => {
    this._electronService?.send('activateButtonAngular', 'activar');
    this._electronService?.on(
      'activateButtonElectron',
      (event: any, arg: string) => {
        this.BotonAtrasAlante = arg === 'BotonActivado';
        this.onBotonAtrasAlante.emit(this.BotonAtrasAlante);
        this.cdRef.detectChanges();
      }
    );
  };
  goBack(): void {
    this.location.back();
  }

  getForward(): void {
    this.location.forward();
  }
  ngOnDestroy(): void {
    this._electronService.removeAllListeners('activateButtonElectron');
  }
}
