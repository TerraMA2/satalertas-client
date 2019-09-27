import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeforestationHistoryComponent } from './deforestation-history.component';

describe('DeforestationHistoryComponent', () => {
  let component: DeforestationHistoryComponent;
  let fixture: ComponentFixture<DeforestationHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeforestationHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeforestationHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
