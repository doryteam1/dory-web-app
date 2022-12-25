import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterfazTransportadorComponent } from './interfaz-transportador.component';

describe('InterfazTransportadorComponent', () => {
  let component: InterfazTransportadorComponent;
  let fixture: ComponentFixture<InterfazTransportadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterfazTransportadorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterfazTransportadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
