import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardAsociacionComponent } from './card-asociacion.component';

describe('CardAsociacionComponent', () => {
  let component: CardAsociacionComponent;
  let fixture: ComponentFixture<CardAsociacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardAsociacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardAsociacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
