import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumosComponent } from './consumos.component';

describe('ConsumosComponent', () => {
  let component: ConsumosComponent;
  let fixture: ComponentFixture<ConsumosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsumosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
