import { TestBed } from '@angular/core/testing';

import { BranchCountService } from './branch-count.service';

describe('BranchCountService', () => {
  let service: BranchCountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BranchCountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
