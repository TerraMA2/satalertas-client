import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupLinkComponent } from './popup-link.component';

describe('PopupLinkComponent', () => {
  let component: PopupLinkComponent;
  let fixture: ComponentFixture<PopupLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
