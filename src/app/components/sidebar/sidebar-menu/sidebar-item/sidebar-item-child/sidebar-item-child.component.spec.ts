import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarItemChildComponent } from './sidebar-item-child.component';

describe('SidebarItemChildComponent', () => {
  let component: SidebarItemChildComponent;
  let fixture: ComponentFixture<SidebarItemChildComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarItemChildComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarItemChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
