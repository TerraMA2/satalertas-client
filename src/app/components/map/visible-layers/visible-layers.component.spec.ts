import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisibleLayersComponent } from './visible-layers.component';

describe('VisibleLayersComponent', () => {
  let component: VisibleLayersComponent;
  let fixture: ComponentFixture<VisibleLayersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisibleLayersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisibleLayersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
