import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNewSkillsSheetComponent } from './modal-new-skills-sheet.component';

describe('ModalNewSkillsSheetComponent', () => {
  let component: ModalNewSkillsSheetComponent;
  let fixture: ComponentFixture<ModalNewSkillsSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalNewSkillsSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalNewSkillsSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
