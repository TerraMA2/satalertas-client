import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BurningSpotlightsChartComponent } from './burning-spotlights-chart.component';

describe('BurningSpotlightsChartComponent', () => {
  let component: BurningSpotlightsChartComponent;
  let fixture: ComponentFixture<BurningSpotlightsChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BurningSpotlightsChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BurningSpotlightsChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
