import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillsSheetViewComponent } from './skills-sheet-view.component';

describe('SkillsSheetViewComponent', () => {
  let component: SkillsSheetViewComponent;
  let fixture: ComponentFixture<SkillsSheetViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkillsSheetViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillsSheetViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
