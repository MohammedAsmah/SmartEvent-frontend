import { HttpClient } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import * as maptilersdk from '@maptiler/sdk';
import { LocationPicker } from '../location-picker/location-picker';
import { SendInvitation } from '../../invitation/send-invitation/send-invitation';

@Component({
  selector: 'app-event-details',
  imports: [DatePipe,NgIf,NgFor,LocationPicker,SendInvitation],
  templateUrl: './event-details.html',
  styleUrl: './event-details.css'

})
export class EventDetails implements OnInit{
  data = history.state;
  eventId=this.data.id
  event:any
  eventImages:any
  apiUrl= 'http://localhost:8080'
  mapSelectable:boolean=false

  constructor(private http:HttpClient,private router:Router,private cdr: ChangeDetectorRef){

  }

  ngOnInit(): void {
      this.getdetails()
  }
// ngAfterViewInit(): void {
//     this.initMap(this.event.localisation.lng,this.event.localisation.lat)
// }

  getdetails() {
  this.http.get(environment.apiUrl + "api/events/" + this.data.id).subscribe(
    (res: any) => {
      this.event = res;
      console.log("Event loaded:", res);
       // 1) Force Angular to render the template with the new `event`
        // this.cdr.detectChanges();

        // // 2) Now the <div id="map"> exists, so we can initialize the map
        // this.initMap(this.event.localisation.lng, this.event.localisation.lat);
        
    },
    (err) => {
      console.log(err);
    }
  );
    this.http.get(environment.apiUrl+"api/events/images/"+this.data.id).subscribe(
      (res)=>{
        this.eventImages=res
        console.log(res);
        
      },
      (err)=>{
        console.log(err);
        
      }
    )
    
  }
  updateEvent(id:string){
    this.router.navigate(["/updateEvnet"],{state:{id:id}})
  }
  // In your component.ts
hideInvitationForm(event: Event) {
  // Only hide if clicking directly on the container, not its children
  if (event.target === event.currentTarget) {
    const invitationForm = document.getElementById("invitationForm");
    if (invitationForm) {
      invitationForm.style.display = 'none';
    }
  }
}


   showInvitationForm(){
    const invitationForm=document.getElementById("invitationForm")
    if (invitationForm) {
    invitationForm.style.display = 'flex';
  }
  }
  loadEventInvitation(){
    this.router.navigate(["event-invitations"],{state:{id:this.eventId}})
  }

//  map!: maptilersdk.Map;
//  marker: any = null;
 
//  initMap(lng:any,lat:any) {
//   if (!this.event?.localisation) {
//     console.warn("Localisation not available yet");
//     return;
//   }


//   maptilersdk.config.apiKey = 'xSZNNaEoZln2VzUKpyS6';

//   this.map = new maptilersdk.Map({
//     container: 'map',
//     style: maptilersdk.MapStyle.STREETS,
//     center: [lng, lat],
//     zoom: 12
//   });

//   new maptilersdk.Marker()
//     .setLngLat([lng, lat])
//     .addTo(this.map);
// }

}
