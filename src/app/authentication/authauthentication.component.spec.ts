import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthauthenticationComponent } from './authauthentication.component';

describe('AuthauthenticationComponent', () => {
  let component: AuthauthenticationComponent;
  let fixture: ComponentFixture<AuthauthenticationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthauthenticationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthauthenticationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
