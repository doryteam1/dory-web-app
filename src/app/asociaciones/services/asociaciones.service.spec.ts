import { TestBed } from '@angular/core/testing';

import { AsociacionesService } from './asociaciones.service';

describe('AsociacionesService', () => {
  let service: AsociacionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AsociacionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
