import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateEvent } from './update-event';

describe('UpdateEvent', () => {
  let component: UpdateEvent;
  let fixture: ComponentFixture<UpdateEvent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateEvent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateEvent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
