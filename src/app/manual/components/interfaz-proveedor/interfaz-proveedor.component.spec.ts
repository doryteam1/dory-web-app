import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterfazProveedorComponent } from './interfaz-proveedor.component';

describe('InterfazProveedorComponent', () => {
  let component: InterfazProveedorComponent;
  let fixture: ComponentFixture<InterfazProveedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterfazProveedorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterfazProveedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
