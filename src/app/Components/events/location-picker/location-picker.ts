import { AfterViewInit, Component, ElementRef, inject, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import * as maptilersdk from '@maptiler/sdk';
import { EventService } from '../../../Services/event-service';

@Component({
  selector: 'app-location-picker',
  standalone: true,
  templateUrl: './location-picker.html',
  styleUrls: ['./location-picker.css']
})
export class LocationPicker implements AfterViewInit, OnChanges {
  @Input() localisation: any;
  @Input() selectable: boolean=false;
  
constructor(private eventService:EventService){
  
}
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef<HTMLDivElement>;
  map: any;
  marker: any;
  private viewInitialized = false;

  ngAfterViewInit() {
    this.viewInitialized = true;
    this.tryInitMap();

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['localisation'] && this.viewInitialized) {
      this.tryInitMap();
    }
  }

  private tryInitMap() {
  if (!this.localisation || !this.mapContainer) {
    console.log("Cannot init map - missing data:", { 
      hasLocalisation: !!this.localisation, 
      hasContainer: !!this.mapContainer 
    });
    return;
  }

  console.log("Localisation received:", this.localisation);
  console.log("Localisation type:", typeof this.localisation);

  // Parse if it's a string
  let locationData = this.localisation;
  let lat: number;
let lng: number;

if (typeof this.localisation === 'string') {
  const parts = this.localisation.split(',');

  if (parts.length !== 2) {
    console.error('Invalid localisation format:', this.localisation);
    return;
  }

  lng = parseFloat(parts[0]);
  lat = parseFloat(parts[1]);
} else {
  lat = parseFloat(this.localisation.lat);
  lng = parseFloat(this.localisation.lng);
}

  if (!isNaN(lat) && !isNaN(lng)) {
    console.log("Loading map with coords:", { lat, lng });
    this.eventService.setEventLcalisationForUpdate(lng,lat)
    this.loadMap(lat, lng);
  } else {
    console.error("Invalid coordinates:", { lat, lng, locationData });
  }
}

  loadMap(lat: number, lng: number) {
    if (!this.map) {
      maptilersdk.config.apiKey = 'xSZNNaEoZln2VzUKpyS6';
      
      this.map = new maptilersdk.Map({
        container: this.mapContainer.nativeElement,
        style: maptilersdk.MapStyle.STREETS,
        center: [lng, lat],
        zoom: 12
      });

      this.marker = new maptilersdk.Marker()
        .setLngLat([lng, lat])
        .addTo(this.map);
        
      console.log("Map initialized successfully");
    } else {
      this.map.setCenter([lng, lat]);
      if (this.marker) {
        this.marker.setLngLat([lng, lat]);
      }
    }
    
    if(this.selectable){
      // CLICK ON MAP TO SELECT LOCATION
        this.map.on('click', (e: any) => {
          const lng = e.lngLat.lng;
          const lat = e.lngLat.lat;
      
          // Update form control
          this.eventService.setEventLcalisationForUpdate(lng,lat)
          console.log(this.eventService.getEventLocalisationForUpdate());
          
          
      
          // Add or move marker
          if (this.marker) {
            this.marker.setLngLat([lng, lat]);
          } else {
            this.marker = new maptilersdk.Marker().setLngLat([lng, lat]).addTo(this.map);
          }
        });
    }
  }
}