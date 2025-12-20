import { Component } from '@angular/core';

@Component({
  selector: 'app-event-guest',
  imports: [],
  templateUrl: './event-guest.html',
  styleUrl: './event-guest.css'
})
export class EventGuest {
eventId: string | null = history.state?.id ?? null;

}
