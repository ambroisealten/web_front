import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArraySkillsUpdatesComponent } from './array-skillsUpdates.component';

describe('ArrayComponentComponent', () => {
  let component: ArraySkillsUpdatesComponent;
  let fixture: ComponentFixture<ArraySkillsUpdatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArraySkillsUpdatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArraySkillsUpdatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
