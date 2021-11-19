import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PiscicultoresComponent } from './piscicultores.component';

describe('PiscicultoresComponent', () => {
  let component: PiscicultoresComponent;
  let fixture: ComponentFixture<PiscicultoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PiscicultoresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PiscicultoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
