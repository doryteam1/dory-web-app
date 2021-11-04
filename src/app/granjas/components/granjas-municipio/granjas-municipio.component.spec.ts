import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GranjasMunicipioComponent } from './granjas-municipio.component';

describe('GranjasMunicipioComponent', () => {
  let component: GranjasMunicipioComponent;
  let fixture: ComponentFixture<GranjasMunicipioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GranjasMunicipioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GranjasMunicipioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
