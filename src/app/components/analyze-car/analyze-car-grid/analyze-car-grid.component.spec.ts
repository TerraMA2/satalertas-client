import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyzeCarGridComponent } from './analyze-car-grid.component';

describe('AnalyzeCarGridComponent', () => {
  let component: AnalyzeCarGridComponent;
  let fixture: ComponentFixture<AnalyzeCarGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalyzeCarGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyzeCarGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
