import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterfazInvestigadorComponent } from './interfaz-investigador.component';

describe('InterfazInvestigadorComponent', () => {
  let component: InterfazInvestigadorComponent;
  let fixture: ComponentFixture<InterfazInvestigadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterfazInvestigadorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterfazInvestigadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
