import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapSucreComponent } from './map-sucre.component';

describe('MapSucreComponent', () => {
  let component: MapSucreComponent;
  let fixture: ComponentFixture<MapSucreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapSucreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapSucreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
