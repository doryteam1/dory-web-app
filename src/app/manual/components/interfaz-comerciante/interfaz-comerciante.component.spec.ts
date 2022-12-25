import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterfazComercianteComponent } from './interfaz-comerciante.component';

describe('InterfazComercianteComponent', () => {
  let component: InterfazComercianteComponent;
  let fixture: ComponentFixture<InterfazComercianteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterfazComercianteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterfazComercianteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
