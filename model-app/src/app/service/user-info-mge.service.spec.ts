import { TestBed } from '@angular/core/testing';

import { UserInfoMgeService } from './user-info-mge.service';

describe('UserInfoMgeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserInfoMgeService = TestBed.get(UserInfoMgeService);
    expect(service).toBeTruthy();
  });
});
