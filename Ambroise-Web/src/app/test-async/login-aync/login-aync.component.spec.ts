import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginAyncComponent } from './login-aync.component';

describe('LoginAyncComponent', () => {
  let component: LoginAyncComponent;
  let fixture: ComponentFixture<LoginAyncComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginAyncComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginAyncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
