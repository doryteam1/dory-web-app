import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GranjaGalleryComponent } from './granja-gallery.component';

describe('GranjaGalleryComponent', () => {
  let component: GranjaGalleryComponent;
  let fixture: ComponentFixture<GranjaGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GranjaGalleryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GranjaGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
