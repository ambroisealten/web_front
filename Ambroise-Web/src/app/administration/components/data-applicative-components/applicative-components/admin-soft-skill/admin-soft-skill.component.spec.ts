import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSoftSkillComponent } from './admin-soft-skill.component';

describe('AdminSoftSkillComponent', () => {
  let component: AdminSoftSkillComponent;
  let fixture: ComponentFixture<AdminSoftSkillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminSoftSkillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSoftSkillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
