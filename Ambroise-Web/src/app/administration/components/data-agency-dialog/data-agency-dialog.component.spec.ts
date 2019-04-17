import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataAgencyDialogComponent } from './data-agency-dialog.component';

describe('DataAgencyDialogComponent', () => {
  let component: DataAgencyDialogComponent;
  let fixture: ComponentFixture<DataAgencyDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataAgencyDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataAgencyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
