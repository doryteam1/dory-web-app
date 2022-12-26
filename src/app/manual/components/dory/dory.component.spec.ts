import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoryComponent } from './dory.component';

describe('DoryComponent', () => {
  let component: DoryComponent;
  let fixture: ComponentFixture<DoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
