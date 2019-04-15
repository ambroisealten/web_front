import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageSkillsHomeComponent } from './page-skills-home.component';

describe('PageSkillsHomeComponent', () => {
  let component: PageSkillsHomeComponent;
  let fixture: ComponentFixture<PageSkillsHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageSkillsHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageSkillsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
