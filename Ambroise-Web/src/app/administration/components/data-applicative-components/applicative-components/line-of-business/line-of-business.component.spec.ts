import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineOfBusinessComponent } from './line-of-business.component';

describe('LineOfBusinessComponent', () => {
  let component: LineOfBusinessComponent;
  let fixture: ComponentFixture<LineOfBusinessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineOfBusinessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineOfBusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
