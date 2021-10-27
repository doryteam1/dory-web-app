import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GranjasComponent } from './granjas.component';

describe('GranjasComponent', () => {
  let component: GranjasComponent;
  let fixture: ComponentFixture<GranjasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GranjasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GranjasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
