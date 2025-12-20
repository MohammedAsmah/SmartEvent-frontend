import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventInvitations } from './event-invitations';

describe('EventInvitations', () => {
  let component: EventInvitations;
  let fixture: ComponentFixture<EventInvitations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventInvitations]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventInvitations);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
