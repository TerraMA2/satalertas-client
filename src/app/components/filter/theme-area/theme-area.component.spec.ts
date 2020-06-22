import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeAreaComponent } from './theme-area.component';

describe('ThemeAreaComponent', () => {
  let component: ThemeAreaComponent;
  let fixture: ComponentFixture<ThemeAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThemeAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemeAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
