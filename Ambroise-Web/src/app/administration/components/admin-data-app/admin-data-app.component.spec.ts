import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDataAppComponent } from './admin-data-app.component';

describe('AdminDataAppComponent', () => {
  let component: AdminDataAppComponent;
  let fixture: ComponentFixture<AdminDataAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminDataAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDataAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});