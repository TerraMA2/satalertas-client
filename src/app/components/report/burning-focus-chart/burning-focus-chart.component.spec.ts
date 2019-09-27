import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BurningFocusChartComponent } from './burning-focus-chart.component';

describe('BurningFocusChartComponent', () => {
  let component: BurningFocusChartComponent;
  let fixture: ComponentFixture<BurningFocusChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BurningFocusChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BurningFocusChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
