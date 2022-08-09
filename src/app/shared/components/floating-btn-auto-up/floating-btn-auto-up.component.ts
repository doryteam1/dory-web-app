import { Component, OnInit, Inject, HostListener, Input, ElementRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-floating-btn-auto-up',
  templateUrl: './floating-btn-auto-up.component.html',
  styleUrls: ['./floating-btn-auto-up.component.scss'],
})
export class FloatingBtnAutoUpComponent implements OnInit {
  @Input() parentContainer:ElementRef | undefined;
  windowScrolled: boolean | undefined;
  constructor(@Inject(DOCUMENT) private document: Document) {}
  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop > 100
    ) {
      this.windowScrolled = true;
    } else if (
      (this.windowScrolled && window.pageYOffset) ||
      document.documentElement.scrollTop ||
      document.body.scrollTop < 10
    ) {
      this.windowScrolled = false;
    }
  }
  scrollToBottom(): void {
    (function smoothscroll() {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    })();
  }
  ngOnInit(): void {}

  onScrollContainer(scrollTop:number){
    if (
      scrollTop ||
      scrollTop > 100
    ) {
      this.windowScrolled = true;
    } else if (
      scrollTop ||
      scrollTop < 10
    ) {
      this.windowScrolled = false;
    }
  }

  scrollToBottomContainer(): void {
    console.log(this.parentContainer);
      this.parentContainer!.nativeElement!.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth',
        block: 'start',
        inline: 'start',
      });
  }

/* scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'start',
    }); */
  onClick() {}
  /*  scrollToBottom(): void {
    console.log('Scroll');
    window.scrollTo(0, 0);
  } */
}
