import { ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import { Location } from '@angular/common';
import { ElectronjsService } from 'src/app/services/electronjs.service';
@Component({
  selector: 'app-floatin-btns-alante-atras',
  templateUrl: './floatin-btns-alante-atras.component.html',
  styleUrls: ['./floatin-btns-alante-atras.component.scss'],
})
export class FloatinBtnsAlanteAtrasComponent implements OnInit, OnDestroy {
  bottonBack: boolean = true;
  bottonForward: boolean = false;
  constructor(
    private location: Location,
    private cdRef: ChangeDetectorRef,
    private _electronService: ElectronjsService
  ) {}
  ngOnInit(): void {
    this.activatebutton();
  }
  ngOnDestroy(): void {
    this._electronService.removeAllListeners('canGoForward');
    this._electronService.removeAllListeners('canGoBack');
  }
  activatebutton = (): void => {
    this._electronService?.on('canGoForward', (event: any, arg:boolean) => {
      this.bottonForward=arg
      this.cdRef.detectChanges();
    });
    this._electronService?.on('canGoBack', (event: any, arg: boolean) => {
      this.bottonBack = arg;
      this.cdRef.detectChanges();
    });
  };
  goBack(): void {
    this.location.historyGo(-1);
  }
  getForward(): void {
    this.location.historyGo(1);
  }
}
