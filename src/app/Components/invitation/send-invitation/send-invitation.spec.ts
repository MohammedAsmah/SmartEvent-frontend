import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendInvitation } from './send-invitation';

describe('SendInvitation', () => {
  let component: SendInvitation;
  let fixture: ComponentFixture<SendInvitation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SendInvitation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendInvitation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
