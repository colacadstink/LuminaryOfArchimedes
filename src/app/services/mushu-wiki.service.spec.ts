import { TestBed } from '@angular/core/testing';

import { MushuWikiService } from './mushu-wiki.service';

describe('MushuWikiService', () => {
  let service: MushuWikiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MushuWikiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
