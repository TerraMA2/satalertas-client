import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassAreaComponent } from './class-area.component';

describe('ClassAreaComponent', () => {
  let component: ClassAreaComponent;
  let fixture: ComponentFixture<ClassAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
