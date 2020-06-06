import { TestBed } from '@angular/core/testing';

import { ShearPlateService } from './shear-plate.service';

describe('ShearPlateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShearPlateService = TestBed.get(ShearPlateService);
    expect(service).toBeTruthy();
  });
});
