import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsociacionDetalleFormComponent } from './asociacion-detalle-form.component';

describe('AsociacionDetalleFormComponent', () => {
  let component: AsociacionDetalleFormComponent;
  let fixture: ComponentFixture<AsociacionDetalleFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsociacionDetalleFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsociacionDetalleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
