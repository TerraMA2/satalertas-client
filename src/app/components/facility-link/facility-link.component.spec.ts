import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityLinkComponent } from './facility-link.component';

describe('FacilityLinkComponent', () => {
  let component: FacilityLinkComponent;
  let fixture: ComponentFixture<FacilityLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacilityLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
