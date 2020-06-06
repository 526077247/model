import { TestBed } from '@angular/core/testing';

import { FavoriteScriptMgeService } from './favorite-script-mge.service';

describe('FavoriteScriptMgeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FavoriteScriptMgeService = TestBed.get(FavoriteScriptMgeService);
    expect(service).toBeTruthy();
  });
});
