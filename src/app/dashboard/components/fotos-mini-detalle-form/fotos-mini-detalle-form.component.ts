import { Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs/internal/Subscription';
import { MediaQueryService } from 'src/app/services/media-query.service';

@Component({
  selector: 'app-fotos-mini-detalle-form',
  templateUrl: './fotos-mini-detalle-form.component.html',
  styleUrls: ['./fotos-mini-detalle-form.component.scss'],
})
export class FotosMiniDetalleFormComponent implements OnInit, OnDestroy {
  @Input() fotos: Array<string | SafeUrl> = [];
  @Input() modalMode: string = 'update';
  @Input() loadingphoto: boolean = false;
  @Output() onDetalle: EventEmitter<any> = new EventEmitter();
  showMore: boolean = false;
  mediaQuerySubscrip!: Subscription;


  constructor(public mediaQueryService: MediaQueryService) {}

  ngOnInit(): void {
    this.mediaQuerySubscrip = this.mediaQueryService
      .mediaQuery('max-width: 625px')
      .subscribe((matches) => {
        this.showMore = matches ? true : false;
      });
  }

  openPhotosModal() {
    this.onDetalle.emit();
  }

  ngOnDestroy(): void {
    this.mediaQuerySubscrip.unsubscribe();
  }
}
