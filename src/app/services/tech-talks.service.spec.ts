import {TestBed} from '@angular/core/testing';

import {TechTalksService} from './tech-talks.service';

describe('TechTalksService', () => {
  let service: TechTalksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TechTalksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
