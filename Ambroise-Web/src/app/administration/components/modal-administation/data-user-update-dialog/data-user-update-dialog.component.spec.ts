import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataUserUpdateDialogComponent } from './data-user-update-dialog.component';

describe('DataUserUpdateDialogComponent', () => {
  let component: DataUserUpdateDialogComponent;
  let fixture: ComponentFixture<DataUserUpdateDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataUserUpdateDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataUserUpdateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
