import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryProdesChartComponent } from './history-prodes-chart.component';

describe('HistoryProdesChartComponent', () => {
  let component: HistoryProdesChartComponent;
  let fixture: ComponentFixture<HistoryProdesChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryProdesChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryProdesChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
