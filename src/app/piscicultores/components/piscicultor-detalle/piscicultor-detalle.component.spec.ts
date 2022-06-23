import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PiscicultorDetalleComponent } from './piscicultor-detalle.component';

describe('PiscicultorDetalleComponent', () => {
  let component: PiscicultorDetalleComponent;
  let fixture: ComponentFixture<PiscicultorDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PiscicultorDetalleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PiscicultorDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
