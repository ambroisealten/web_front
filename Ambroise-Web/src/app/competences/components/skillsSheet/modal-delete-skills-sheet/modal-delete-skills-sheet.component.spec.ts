import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDeleteSkillsSheetComponent } from './modal-delete-skills-sheet.component';

describe('ModalDeleteSkillsSheetComponent', () => {
  let component: ModalDeleteSkillsSheetComponent;
  let fixture: ComponentFixture<ModalDeleteSkillsSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalDeleteSkillsSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDeleteSkillsSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
