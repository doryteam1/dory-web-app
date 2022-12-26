import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NovedadesActualidadComponent } from './novedades-actualidad.component';

describe('NovedadesActualidadComponent', () => {
  let component: NovedadesActualidadComponent;
  let fixture: ComponentFixture<NovedadesActualidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NovedadesActualidadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NovedadesActualidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
