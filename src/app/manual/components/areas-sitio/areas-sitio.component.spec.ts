import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreasSitioComponent } from './areas-sitio.component';

describe('AreasSitioComponent', () => {
  let component: AreasSitioComponent;
  let fixture: ComponentFixture<AreasSitioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AreasSitioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AreasSitioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
