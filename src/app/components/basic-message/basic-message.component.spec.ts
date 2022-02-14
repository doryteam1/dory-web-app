import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicMessageComponent } from './basic-message.component';

describe('BasicMessageComponent', () => {
  let component: BasicMessageComponent;
  let fixture: ComponentFixture<BasicMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasicMessageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
