import { TestBed } from '@angular/core/testing';

import { ListFoldersService } from './list-folders.service';

describe('ListFoldersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ListFoldersService = TestBed.get(ListFoldersService);
    expect(service).toBeTruthy();
  });
});
