import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardphotoGoogleMapComponent } from './cardphoto-google-map.component';

describe('CardphotoGoogleMapComponent', () => {
  let component: CardphotoGoogleMapComponent;
  let fixture: ComponentFixture<CardphotoGoogleMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardphotoGoogleMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardphotoGoogleMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
