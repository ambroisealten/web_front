import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAvailabilityComponent } from './modal-availability.component';

describe('ModalAvailabilityComponent', () => {
  let component: ModalAvailabilityComponent;
  let fixture: ComponentFixture<ModalAvailabilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAvailabilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAvailabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
