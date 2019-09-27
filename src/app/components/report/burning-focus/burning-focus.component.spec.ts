import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BurningFocusComponent } from './burning-focus.component';

describe('BurningFocusComponent', () => {
  let component: BurningFocusComponent;
  let fixture: ComponentFixture<BurningFocusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BurningFocusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BurningFocusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
