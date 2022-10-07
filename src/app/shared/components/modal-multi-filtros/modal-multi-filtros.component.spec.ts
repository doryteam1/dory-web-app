import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalMultiFiltrosComponent } from './modal-multi-filtros.component';

describe('ModalMultiFiltrosComponent', () => {
  let component: ModalMultiFiltrosComponent;
  let fixture: ComponentFixture<ModalMultiFiltrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalMultiFiltrosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalMultiFiltrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
