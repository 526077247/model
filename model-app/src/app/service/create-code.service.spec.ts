import { TestBed } from '@angular/core/testing';

import { CreateCodeSvr } from './create-code.service';

describe('CreateCodeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CreateCodeSvr = TestBed.get(CreateCodeSvr);
    expect(service).toBeTruthy();
  });
});
