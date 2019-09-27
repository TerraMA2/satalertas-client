import { TestBed } from '@angular/core/testing';

import { HTTPService } from './http.service';

describe('HTTPService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HTTPService = TestBed.get(HTTPService);
    expect(service).toBeTruthy();
  });
});
