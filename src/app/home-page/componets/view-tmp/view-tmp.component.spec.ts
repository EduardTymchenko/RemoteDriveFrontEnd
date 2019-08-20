import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTmpComponent } from './view-tmp.component';

describe('ViewTmpComponent', () => {
  let component: ViewTmpComponent;
  let fixture: ComponentFixture<ViewTmpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewTmpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
