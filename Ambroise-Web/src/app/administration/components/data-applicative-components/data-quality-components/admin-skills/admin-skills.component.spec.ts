import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSkillsComponent } from './admin-skills.component';

describe('AdminSkillsComponent', () => {
  let component: AdminSkillsComponent;
  let fixture: ComponentFixture<AdminSkillsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminSkillsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSkillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
