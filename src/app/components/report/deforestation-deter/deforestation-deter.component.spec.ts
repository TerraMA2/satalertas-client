import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeforestationDeterComponent } from './deforestation-deter.component';

describe('DeforestationDeterComponent', () => {
  let component: DeforestationDeterComponent;
  let fixture: ComponentFixture<DeforestationDeterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeforestationDeterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeforestationDeterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
