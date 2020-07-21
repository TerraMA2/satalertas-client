import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayerToolsComponent } from './layer-tools.component';

describe('LayerToolsComponent', () => {
  let component: LayerToolsComponent;
  let fixture: ComponentFixture<LayerToolsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayerToolsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayerToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
