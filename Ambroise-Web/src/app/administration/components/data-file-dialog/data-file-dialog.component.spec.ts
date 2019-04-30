import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataFileDialogComponent } from './data-file-dialog.component';

describe('DataFileDialogComponent', () => {
  let component: DataFileDialogComponent;
  let fixture: ComponentFixture<DataFileDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataFileDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataFileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
