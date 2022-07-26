import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisAsociacionesComponent } from './mis-asociaciones.component';

describe('MisAsociacionesComponent', () => {
  let component: MisAsociacionesComponent;
  let fixture: ComponentFixture<MisAsociacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MisAsociacionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MisAsociacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
