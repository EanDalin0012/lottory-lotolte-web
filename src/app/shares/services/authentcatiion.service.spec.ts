import { TestBed } from '@angular/core/testing';

import { AuthentcatiionService } from './authentcatiion.service';

describe('AuthentcatiionService', () => {
  let service: AuthentcatiionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthentcatiionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
