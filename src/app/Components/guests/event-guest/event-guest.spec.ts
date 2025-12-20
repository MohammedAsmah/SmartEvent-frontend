import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventGuest } from './event-guest';

describe('EventGuest', () => {
  let component: EventGuest;
  let fixture: ComponentFixture<EventGuest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventGuest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventGuest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
