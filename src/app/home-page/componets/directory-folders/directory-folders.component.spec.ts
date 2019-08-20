import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectoryFoldersComponent } from './directory-folders.component';

describe('DirectoryFoldersComponent', () => {
  let component: DirectoryFoldersComponent;
  let fixture: ComponentFixture<DirectoryFoldersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DirectoryFoldersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectoryFoldersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
