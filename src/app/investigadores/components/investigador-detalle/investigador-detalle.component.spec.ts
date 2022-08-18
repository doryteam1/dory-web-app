import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigadorDetalleComponent } from './investigador-detalle.component';

describe('InvestigadorDetalleComponent', () => {
  let component: InvestigadorDetalleComponent;
  let fixture: ComponentFixture<InvestigadorDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvestigadorDetalleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestigadorDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
