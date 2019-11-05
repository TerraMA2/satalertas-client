import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarLayerComponent } from './sidebar-layer.component';

describe('SidebarItemChildComponent', () => {
  let component: SidebarLayerComponent;
  let fixture: ComponentFixture<SidebarLayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarLayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
