import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BurnedAreasComponent } from './burned-areas.component';

describe('BurnedAreasComponent', () => {
  let component: BurnedAreasComponent;
  let fixture: ComponentFixture<BurnedAreasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BurnedAreasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BurnedAreasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
