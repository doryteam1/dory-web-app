import { TestBed } from '@angular/core/testing';

import { AreasExperticiaService } from './areas-experticia.service';

describe('AreasExperticiaService', () => {
  let service: AreasExperticiaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AreasExperticiaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
