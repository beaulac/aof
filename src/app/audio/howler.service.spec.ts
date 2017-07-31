import { TestBed, inject } from '@angular/core/testing';

import { HowlerService } from './howler.service';

describe('HowlerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HowlerService]
    });
  });

  it('should be created', inject([HowlerService], (service: HowlerService) => {
    expect(service).toBeTruthy();
  }));
});
