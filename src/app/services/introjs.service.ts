import { EventEmitter, Injectable, Output } from '@angular/core';
import { IntroGuidedTour } from 'src/models/introJsTourt.model';
/* import { AppModalService } from '../shared/services/app-modal.service'; */
/// <reference path="../../../../../node_modules/@types/intro.js/index.d.ts" />
declare var introJs: any;
/* https://npm.io/package/intro.js */
/* https://introjs.com/docs/intro/options#dontshowagainlabel */
/* https://joachimstougaard.medium.com/intro-js-in-a-angular-application-8870b0a4702a */
/* https://dev.to/devpato/show-how-to-use-your-app-with-step-by-step-guide-with-intro-js-in-angular-2f6k */
@Injectable({
  providedIn: 'root',
})
export class IntrojsService {
  @Output() onElementoActivoTour: EventEmitter<any> = new EventEmitter();
  @Output() onCompleteTourt: EventEmitter<boolean> = new EventEmitter();
  introJS: any = null;
/*   constructor(private appModalService: AppModalService) {} */
  tourPrincipal(steps: IntroGuidedTour[]) {
    this.introJS = introJs();
    /* Emite el elemento activo */
    this.introJS.onbeforechange(async (element: any) => {
      try {
        this.onElementoActivoTour.emit(element);
      } catch (err) {
        this.onElementoActivoTour.emit(null);
      }
    });;
    /* Emite, cuando se completa el tour */
    this.introJS.oncomplete(() => {
      this.onCompleteTourt.emit(true);
    });
    /* Obciones para el tour */
    this.introJS
      .setOptions({
        exitOnEsc: false,
        nextLabel: 'Siguiente',
        prevLabel: 'Atrás',
        doneLabel: 'Listo',
        keyboardNavigation: true,
        showStepNumbers: true,
        stepNumbersOfLabel: 'de',
        showBullets: false,
        disableInteraction: true,
        buttonClass: 'buttonClassIntroJs',
        tooltipClass: 'customTooltip',
        /* exitOnOverlayClick: false, */
        steps: steps,
      })
      .start();
  }
  miniTour(steps: IntroGuidedTour[]) {
    this.introJS = introJs();
    this.introJS
      .onbeforechange(async (element: any) => {
        try {
          console.log(element);
        } catch (err) {}
      })
      .start();
    this.introJS
      .setOptions({
        exitOnEsc: false,
        nextLabel: 'Siguiente',
        prevLabel: 'Atrás',
        doneLabel: 'Listo',
        keyboardNavigation: true,
        showStepNumbers: true,
        stepNumbersOfLabel: 'de',
        showBullets: false,
        disableInteraction: true,
        /* exitOnOverlayClick: false, */
        buttonClass: 'buttonClassIntroJs',
        tooltipClass: 'customTooltip',
        steps: steps,
      })
      .start();
  }
  closeIntroJs() {
    introJs().exit();
  }

}
