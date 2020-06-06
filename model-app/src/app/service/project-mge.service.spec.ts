import { TestBed } from '@angular/core/testing';

import { ProjectMgeSvr } from './project-mge.service';

describe('ProjectMgeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProjectMgeSvr = TestBed.get(ProjectMgeSvr);
    expect(service).toBeTruthy();
  });
});
