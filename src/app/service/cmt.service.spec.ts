import { TestBed } from '@angular/core/testing';

import { CmtService } from './cmt.service';

describe('CmtService', () => {
  let service: CmtService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CmtService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
