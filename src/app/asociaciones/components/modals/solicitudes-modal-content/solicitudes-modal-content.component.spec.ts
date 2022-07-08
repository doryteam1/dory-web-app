import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesModalContentComponent } from './solicitudes-modal-content.component';

describe('SolicitudesModalContentComponent', () => {
  let component: SolicitudesModalContentComponent;
  let fixture: ComponentFixture<SolicitudesModalContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolicitudesModalContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudesModalContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
