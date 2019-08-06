import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArraySkillsComponent } from './array-skills.component';

describe('ArraySkillsComponent', () => {
  let component: ArraySkillsComponent;
  let fixture: ComponentFixture<ArraySkillsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArraySkillsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArraySkillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
