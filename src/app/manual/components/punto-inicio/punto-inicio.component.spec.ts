import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuntoInicioComponent } from './punto-inicio.component';

describe('PuntoInicioComponent', () => {
  let component: PuntoInicioComponent;
  let fixture: ComponentFixture<PuntoInicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PuntoInicioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PuntoInicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
