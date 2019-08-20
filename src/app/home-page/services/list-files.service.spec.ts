import { TestBed } from '@angular/core/testing';

import { ListFilesService } from './list-files.service';

describe('ListFilesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ListFilesService = TestBed.get(ListFilesService);
    expect(service).toBeTruthy();
  });
});
