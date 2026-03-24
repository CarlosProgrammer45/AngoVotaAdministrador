import { TestBed } from '@angular/core/testing';

import { ServicesActivits } from './services-activits';

describe('ServicesActivits', () => {
  let service: ServicesActivits;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicesActivits);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
