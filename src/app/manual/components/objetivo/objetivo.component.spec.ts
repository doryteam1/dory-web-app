import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjetivoComponent } from './objetivo.component';

describe('ObjetivoComponent', () => {
  let component: ObjetivoComponent;
  let fixture: ComponentFixture<ObjetivoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObjetivoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjetivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
