import { TestBed } from '@angular/core/testing';

import { ServicesBuscar } from './services-buscar';

describe('ServicesBuscar', () => {
  let service: ServicesBuscar;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicesBuscar);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
