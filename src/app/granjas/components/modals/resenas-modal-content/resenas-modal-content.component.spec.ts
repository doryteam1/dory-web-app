import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResenasModalContentComponent } from './resenas-modal-content.component';

describe('ResenasModalContentComponent', () => {
  let component: ResenasModalContentComponent;
  let fixture: ComponentFixture<ResenasModalContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResenasModalContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResenasModalContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
