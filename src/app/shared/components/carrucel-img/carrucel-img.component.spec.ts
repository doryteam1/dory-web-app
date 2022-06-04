import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrucelImgComponent } from './carrucel-img.component';

describe('CarrucelImgComponent', () => {
  let component: CarrucelImgComponent;
  let fixture: ComponentFixture<CarrucelImgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarrucelImgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarrucelImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
