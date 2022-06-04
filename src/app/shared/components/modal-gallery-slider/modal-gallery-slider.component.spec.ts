import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalGallerySliderComponent } from './modal-gallery-slider.component';

describe('ModalGallerySliderComponent', () => {
  let component: ModalGallerySliderComponent;
  let fixture: ComponentFixture<ModalGallerySliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalGallerySliderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalGallerySliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
