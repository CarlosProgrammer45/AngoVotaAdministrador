import { TestBed } from '@angular/core/testing';

import { ServiceEnviar } from './service-enviar';

describe('ServiceEnviar', () => {
  let service: ServiceEnviar;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceEnviar);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
