import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDocumentMenuForumComponent } from './admin-document-menu-forum.component';

describe('AdminDocumentMenuForumComponent', () => {
  let component: AdminDocumentMenuForumComponent;
  let fixture: ComponentFixture<AdminDocumentMenuForumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminDocumentMenuForumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDocumentMenuForumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
