import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisionDetailedComponent } from './vision-detailed.component';

describe('VisionDetailedComponent', () => {
  let component: VisionDetailedComponent;
  let fixture: ComponentFixture<VisionDetailedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisionDetailedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisionDetailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
