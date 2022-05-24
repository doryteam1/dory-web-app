import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisFavoritosComponent } from './mis-favoritos.component';

describe('MisFavoritosComponent', () => {
  let component: MisFavoritosComponent;
  let fixture: ComponentFixture<MisFavoritosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MisFavoritosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MisFavoritosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
