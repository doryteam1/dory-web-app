import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterfazConsumidorComponent } from './interfaz-consumidor.component';

describe('InterfazConsumidorComponent', () => {
  let component: InterfazConsumidorComponent;
  let fixture: ComponentFixture<InterfazConsumidorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterfazConsumidorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterfazConsumidorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
