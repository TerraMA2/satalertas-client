import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BurningSpotlightsComponent } from './burning-spotlights.component';

describe('BurningFocusComponent', () => {
  let component: BurningSpotlightsComponent;
  let fixture: ComponentFixture<BurningSpotlightsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BurningSpotlightsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BurningSpotlightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
