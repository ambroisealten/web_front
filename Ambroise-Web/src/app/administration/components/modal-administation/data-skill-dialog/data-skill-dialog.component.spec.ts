import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSkillDialogComponent } from './data-skill-dialog.component';

describe('DataSkillDialogComponent', () => {
  let component: DataSkillDialogComponent;
  let fixture: ComponentFixture<DataSkillDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataSkillDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataSkillDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
