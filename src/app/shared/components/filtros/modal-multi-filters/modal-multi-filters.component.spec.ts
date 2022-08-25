import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalMultiFiltersComponent } from './modal-multi-filters.component';

describe('ModalMultiFiltersComponent', () => {
  let component: ModalMultiFiltersComponent;
  let fixture: ComponentFixture<ModalMultiFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalMultiFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalMultiFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
