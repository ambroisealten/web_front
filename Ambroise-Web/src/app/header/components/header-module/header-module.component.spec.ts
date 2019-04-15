import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderModuleComponent } from './header-module.component';

describe('HeaderModuleComponent', () => {
  let component: HeaderModuleComponent;
  let fixture: ComponentFixture<HeaderModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
