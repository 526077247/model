import { TestBed } from '@angular/core/testing';

import { LoginMgeSvr } from './login-mge.service';

describe('LoginMgeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LoginMgeSvr = TestBed.get(LoginMgeSvr);
    expect(service).toBeTruthy();
  });
});
