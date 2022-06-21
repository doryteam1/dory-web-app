import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisNegociosComponent } from './mis-negocios.component';

describe('MisNegociosComponent', () => {
  let component: MisNegociosComponent;
  let fixture: ComponentFixture<MisNegociosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MisNegociosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MisNegociosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
