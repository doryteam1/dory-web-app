import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiculoDetalleComponent } from './vehiculo-detalle.component';

describe('VehiculoDetalleComponent', () => {
  let component: VehiculoDetalleComponent;
  let fixture: ComponentFixture<VehiculoDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehiculoDetalleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehiculoDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
