import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeforestationHistoryProdesComponent } from './deforestation-history-prodes.component';

describe('DeforestationHistoryProdesComponent', () => {
  let component: DeforestationHistoryProdesComponent;
  let fixture: ComponentFixture<DeforestationHistoryProdesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeforestationHistoryProdesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeforestationHistoryProdesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
