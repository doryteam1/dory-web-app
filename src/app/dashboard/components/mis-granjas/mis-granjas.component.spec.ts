import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisGranjasComponent } from './mis-granjas.component';

describe('MisGranjasComponent', () => {
  let component: MisGranjasComponent;
  let fixture: ComponentFixture<MisGranjasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MisGranjasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MisGranjasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
