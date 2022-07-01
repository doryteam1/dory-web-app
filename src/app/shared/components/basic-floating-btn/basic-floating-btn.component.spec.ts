import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicFloatingBtnComponent } from './basic-floating-btn.component';

describe('BasicFloatingBtnComponent', () => {
  let component: BasicFloatingBtnComponent;
  let fixture: ComponentFixture<BasicFloatingBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasicFloatingBtnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicFloatingBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
