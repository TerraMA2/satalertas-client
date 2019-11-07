import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecificSearchAreaComponent } from './specific-search-area.component';

describe('SpecificSearchAreaComponent', () => {
  let component: SpecificSearchAreaComponent;
  let fixture: ComponentFixture<SpecificSearchAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecificSearchAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecificSearchAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
