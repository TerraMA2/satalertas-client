import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryDeterChartComponent } from './history-deter-chart.component';

describe('HistoryDeterChartComponent', () => {
  let component: HistoryDeterChartComponent;
  let fixture: ComponentFixture<HistoryDeterChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryDeterChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryDeterChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
