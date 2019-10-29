import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyzeCarFilterComponent } from './analyze-car-filter.component';

describe('AnalyzeCarFilterComponent', () => {
  let component: AnalyzeCarFilterComponent;
  let fixture: ComponentFixture<AnalyzeCarFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalyzeCarFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyzeCarFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
