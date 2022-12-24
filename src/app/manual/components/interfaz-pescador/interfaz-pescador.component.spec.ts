import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterfazPescadorComponent } from './interfaz-pescador.component';

describe('InterfazPescadorComponent', () => {
  let component: InterfazPescadorComponent;
  let fixture: ComponentFixture<InterfazPescadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterfazPescadorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterfazPescadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
