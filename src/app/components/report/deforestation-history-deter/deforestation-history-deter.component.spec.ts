import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeforestationHistoryDeterComponent } from './deforestation-history-deter.component';

describe('DeforestationHistoryDeterComponent', () => {
  let component: DeforestationHistoryDeterComponent;
  let fixture: ComponentFixture<DeforestationHistoryDeterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeforestationHistoryDeterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeforestationHistoryDeterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
