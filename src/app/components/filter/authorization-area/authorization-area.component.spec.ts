import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizationAreaComponent } from './authorization-area.component';

describe('AuthorizationAreaComponent', () => {
  let component: AuthorizationAreaComponent;
  let fixture: ComponentFixture<AuthorizationAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorizationAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorizationAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
