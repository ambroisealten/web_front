import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSkillsCandidateComponent } from './modal-skills-candidate.component';

describe('ModalSkillsCandidateComponent', () => {
  let component: ModalSkillsCandidateComponent;
  let fixture: ComponentFixture<ModalSkillsCandidateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalSkillsCandidateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSkillsCandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
