import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageHistoryComponent } from './image-history.component';

describe('ImageHistoryComponent', () => {
  let component: ImageHistoryComponent;
  let fixture: ComponentFixture<ImageHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
