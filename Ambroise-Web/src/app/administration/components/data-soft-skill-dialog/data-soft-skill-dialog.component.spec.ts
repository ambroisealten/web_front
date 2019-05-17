import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSoftSkillDialogComponent } from './data-soft-skill-dialog.component';

describe('DataSoftSkillDialogComponent', () => {
  let component: DataSoftSkillDialogComponent;
  let fixture: ComponentFixture<DataSoftSkillDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataSoftSkillDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataSoftSkillDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
