import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloatingBtnAutoUpComponent } from './floating-btn-auto-up.component';

describe('FloatingBtnAutoUpComponent', () => {
  let component: FloatingBtnAutoUpComponent;
  let fixture: ComponentFixture<FloatingBtnAutoUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FloatingBtnAutoUpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FloatingBtnAutoUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
