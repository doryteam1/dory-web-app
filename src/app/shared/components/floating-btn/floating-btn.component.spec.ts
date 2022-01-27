import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloatingBtnComponent } from './floating-btn.component';

describe('FloatingBtnComponent', () => {
  let component: FloatingBtnComponent;
  let fixture: ComponentFixture<FloatingBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FloatingBtnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FloatingBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
