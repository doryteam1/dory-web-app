import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportadorDetalleComponent } from './transportador-detalle.component';

describe('TransportadorDetalleComponent', () => {
  let component: TransportadorDetalleComponent;
  let fixture: ComponentFixture<TransportadorDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransportadorDetalleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransportadorDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
