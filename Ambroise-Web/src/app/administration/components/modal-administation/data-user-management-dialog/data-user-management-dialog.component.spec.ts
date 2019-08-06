import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataUserManagementDialogComponent } from './data-user-management-dialog.component';

describe('DataUserManagementDialogComponent', () => {
  let component: DataUserManagementDialogComponent;
  let fixture: ComponentFixture<DataUserManagementDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataUserManagementDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataUserManagementDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
