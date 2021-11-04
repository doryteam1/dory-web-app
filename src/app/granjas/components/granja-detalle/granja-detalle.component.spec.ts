import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GranjaDetalleComponent } from './granja-detalle.component';

describe('GranjaDetalleComponent', () => {
  let component: GranjaDetalleComponent;
  let fixture: ComponentFixture<GranjaDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GranjaDetalleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GranjaDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
