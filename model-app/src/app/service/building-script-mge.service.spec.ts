import { TestBed } from '@angular/core/testing';

import { BuildingScriptMgeSvr } from './building-script-mge.service';

describe('BuildingScriptMgeSvr', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BuildingScriptMgeSvr = TestBed.get(BuildingScriptMgeSvr);
    expect(service).toBeTruthy();
  });
});
