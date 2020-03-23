import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarLayerGroupComponent } from './sidebar-layer-group.component';

describe('SidebarLayerGroupComponent', () => {
  let component: SidebarLayerGroupComponent;
  let fixture: ComponentFixture<SidebarLayerGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarLayerGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarLayerGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
