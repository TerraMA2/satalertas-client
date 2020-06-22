import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BurnedAreasChartComponent } from './burned-areas-chart.component';

describe('BurnedAreasChartComponent', () => {
  let component: BurnedAreasChartComponent;
  let fixture: ComponentFixture<BurnedAreasChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BurnedAreasChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BurnedAreasChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
