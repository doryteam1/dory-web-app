import { TestBed } from '@angular/core/testing';

import { PiscicultoresService } from './piscicultores.service';

describe('PiscicultoresService', () => {
  let service: PiscicultoresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PiscicultoresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
