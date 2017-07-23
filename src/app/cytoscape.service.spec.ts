import { TestBed, inject } from '@angular/core/testing';

import { CytoscapeService } from './cytoscape.service';

describe('CytoscapeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CytoscapeService]
    });
  });

  it('should be created', inject([CytoscapeService], (service: CytoscapeService) => {
    expect(service).toBeTruthy();
  }));
});
