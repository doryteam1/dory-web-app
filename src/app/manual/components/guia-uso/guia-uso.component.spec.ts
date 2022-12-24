import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuiaUsoComponent } from './guia-uso.component';

describe('GuiaUsoComponent', () => {
  let component: GuiaUsoComponent;
  let fixture: ComponentFixture<GuiaUsoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuiaUsoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuiaUsoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
