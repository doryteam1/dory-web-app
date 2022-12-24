import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterfazUsuarioComponent } from './interfaz-usuario.component';

describe('InterfazUsuarioComponent', () => {
  let component: InterfazUsuarioComponent;
  let fixture: ComponentFixture<InterfazUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterfazUsuarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterfazUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
