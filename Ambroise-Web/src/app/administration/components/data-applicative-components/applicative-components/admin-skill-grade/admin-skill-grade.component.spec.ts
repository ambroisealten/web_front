import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSkillGradeComponent } from './admin-skill-grade.component';

describe('AdminSkillGradeComponent', () => {
  let component: AdminSkillGradeComponent;
  let fixture: ComponentFixture<AdminSkillGradeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminSkillGradeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSkillGradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
