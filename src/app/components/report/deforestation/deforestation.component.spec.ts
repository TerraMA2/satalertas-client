import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeforestationComponent } from './deforestation.component';

describe('DeforestationComponent', () => {
  let component: DeforestationComponent;
  let fixture: ComponentFixture<DeforestationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeforestationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeforestationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
