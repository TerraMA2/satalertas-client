import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportLegendComponent } from './report-legend.component';

describe('ReportLegendComponent', () => {
  let component: ReportLegendComponent;
  let fixture: ComponentFixture<ReportLegendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportLegendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportLegendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
