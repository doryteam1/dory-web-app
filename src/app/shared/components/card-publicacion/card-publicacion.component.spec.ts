import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardPublicacionComponent } from './card-publicacion.component';

describe('CardPublicacionComponent', () => {
  let component: CardPublicacionComponent;
  let fixture: ComponentFixture<CardPublicacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardPublicacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardPublicacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
