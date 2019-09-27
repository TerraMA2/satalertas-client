import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyDataComponent } from './property-data.component';

describe('PropertyDataComponent', () => {
  let component: PropertyDataComponent;
  let fixture: ComponentFixture<PropertyDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
