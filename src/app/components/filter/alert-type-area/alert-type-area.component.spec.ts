import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertTypeAreaComponent } from './alert-type-area.component';

describe('AlertTypeAreaComponent', () => {
  let component: AlertTypeAreaComponent;
  let fixture: ComponentFixture<AlertTypeAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertTypeAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertTypeAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
