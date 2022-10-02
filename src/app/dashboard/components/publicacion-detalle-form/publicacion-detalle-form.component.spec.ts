import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicacionDetalleFormComponent } from './publicacion-detalle-form.component';

describe('PublicacionDetalleFormComponent', () => {
  let component: PublicacionDetalleFormComponent;
  let fixture: ComponentFixture<PublicacionDetalleFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicacionDetalleFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicacionDetalleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
