import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { AppModalService } from '../../../shared/services/app-modal.service';
import { PlatformLocation } from '@angular/common';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';


@Component({
  selector: 'app-modal-google-general',
  templateUrl: './modal-google-general.component.html',
  styleUrls: ['./modal-google-general.component.scss'],
})
export class ModalGoogleGeneralComponent implements OnInit {
  @Input() atributos: any = {};
  @Input() modalheader!: boolean;
  @Input() iconMarkerGoogleMap!: string;
  @Input() shared: boolean = false;
  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow;
  @ViewChild('marker') marker!: MapMarker;
  @ViewChild('myGoogleMap', { static: false })
  map!: GoogleMap;
  markerPositions: google.maps.LatLngLiteral[] = [];
  markersInfo: any[] = [];
  mapaOn: boolean = false;
  options: google.maps.MapOptions = {
    center: { lat: 9.214145, lng: -75.188469 },
    zoom: 10,
    scrollwheel: true,
  };
  markerPosition: google.maps.LatLngLiteral = {
    lat: 9.214145,
    lng: -75.188469,
  };
  markerOptions: google.maps.MarkerOptions = { draggable: false };
  apiLoaded!: Observable<boolean>;
  indexSelected: number = -1;
  ngOnInit(): void {
    const sucreColombia = {
      north: 10.184454,
      south: 8.136442,
      west: -75.842392,
      east: -74.324908,
    };
    this.options = {
      center: {
        lat: parseFloat(this.atributos.longAndLat.lat),
        lng: parseFloat(this.atributos.longAndLat.lng),
      },
      zoom: 13,
      scrollwheel: true,
      restriction: {
        latLngBounds: sucreColombia,
        strictBounds: false,
      },
      streetViewControl: false,
      fullscreenControl: false,
    };
    this.markerPosition = {
      lat: parseFloat(this.atributos.longAndLat.lat),
      lng: parseFloat(this.atributos.longAndLat.lng),
    };
  }

  constructor(
    httpClient: HttpClient,
    private _modalService: NgbActiveModal,
    private appModalService: AppModalService,
    public location: PlatformLocation
  ) {
    this.apiLoaded = httpClient
      .jsonp(
        'https://maps.googleapis.com/maps/api/js?key=' + environment.mapsApiKey,
        'callback'
      )
      .pipe(
        map(() => true),
        catchError(() => of(false))
      );
  }
  mapainiciado() {
    /* https://www.freakyjolly.com/angular-google-maps-integration-with-markers-info-windows-tutorial/ */
    this.openInfoWindow(this.marker);
    this.mapaOn = true;
  }

  public decline() {
    this._modalService.close(false);
  }
  public accept() {
    this._modalService.close(true);
  }
  public dismiss() {
    this._modalService.dismiss();
  }
  openInfoWindow(marker: MapMarker) {
    this.infoWindow.open(marker);
  }
  eliminInfoWindow() {
    this.infoWindow.close();
  }
  share() {
    if(this.shared){
      this.location.onPopState(() => {
        this.appModalService.closeModalShare();
      });
      this.appModalService
        .shared(
          `${this.atributos.nombreAtributo.dato1}`,
          true,
          `https://www.google.com/maps?q=${this.atributos.longAndLat.lat},${this.atributos.longAndLat.lng}`,
          ``
        )
        .then((result) => {})
        .catch((result) => {});
    }
    }
}
