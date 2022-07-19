import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiembrosAsociacionModalContentComponent } from './miembros-asociacion-modal-content.component';

describe('MiembrosAsociacionModalContentComponent', () => {
  let component: MiembrosAsociacionModalContentComponent;
  let fixture: ComponentFixture<MiembrosAsociacionModalContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiembrosAsociacionModalContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiembrosAsociacionModalContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
