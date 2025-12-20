import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private EventLcalisationForUpdate = signal<string>('');
  getEventLocalisationForUpdate = this.EventLcalisationForUpdate.asReadonly();

setEventLcalisationForUpdate(lng:any,lat:any){
  const loc=lng+","+lat
this.EventLcalisationForUpdate.set(loc)
}

  
}
