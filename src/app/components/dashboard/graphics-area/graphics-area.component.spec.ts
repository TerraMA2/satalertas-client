import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphicsAreaComponent } from './graphics-area.component';

describe('GraphicsAreaComponent', () => {
  let component: GraphicsAreaComponent;
  let fixture: ComponentFixture<GraphicsAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphicsAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphicsAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
