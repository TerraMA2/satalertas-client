import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyzeCarComponent } from './analyze-car.component';

describe('AnalyzeCarComponent', () => {
  let component: AnalyzeCarComponent;
  let fixture: ComponentFixture<AnalyzeCarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalyzeCarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyzeCarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
