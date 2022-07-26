import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiConsumoComponent } from './mi-consumo.component';

describe('MiConsumoComponent', () => {
  let component: MiConsumoComponent;
  let fixture: ComponentFixture<MiConsumoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiConsumoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiConsumoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
