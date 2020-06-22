import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterFilterAreaComponent } from './footer-filter-area.component';

describe('FooterFilterAreaComponent', () => {
  let component: FooterFilterAreaComponent;
  let fixture: ComponentFixture<FooterFilterAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FooterFilterAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterFilterAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
