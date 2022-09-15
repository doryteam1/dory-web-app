import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NegocioDetalleComponent } from './negocio-detalle.component';

describe('NegocioDetalleComponent', () => {
  let component: NegocioDetalleComponent;
  let fixture: ComponentFixture<NegocioDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NegocioDetalleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NegocioDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
