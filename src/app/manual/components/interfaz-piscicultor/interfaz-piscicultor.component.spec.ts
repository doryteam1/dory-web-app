import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterfazPiscicultorComponent } from './interfaz-piscicultor.component';

describe('InterfazPiscicultorComponent', () => {
  let component: InterfazPiscicultorComponent;
  let fixture: ComponentFixture<InterfazPiscicultorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterfazPiscicultorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterfazPiscicultorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
