import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import * as maptilersdk from '@maptiler/sdk';
import { environment } from '../../../../environments/environment';
import { LocationPicker } from '../location-picker/location-picker';
import { EventService } from '../../../Services/event-service';

interface EventTypesResponse {
  eventsType: string[];
  eventStatus: string[];
}

@Component({
  selector: 'app-update-event',
  imports: [ReactiveFormsModule, NgFor, NgIf,LocationPicker],
  templateUrl: './update-event.html',
  styleUrl: './update-event.css'
})
export class UpdateEvent implements OnInit {
  environment=environment
  eventForm!: FormGroup;
  data = history.state;
  eventId: string = '';
  
  eventTypes: string[] = [];
  eventStatuses: string[] = [];
  
  selectedLogo: File | null = null;
  selectedCouverture: File | null = null;
  selectedImages: File[] = [];
  
  logoPreview: string | null = null;
  couverturePreview: string | null = null;
  imagePreviews: string[] = [];
  
  // Existing images from server
  existingImages: any[] = [];
  existingLogoUrl: string | null = null;
  existingCouvertureUrl: string | null = null;
  
  isLoading: boolean = true;
  mapSelectable:boolean=true
  logoChanged:boolean=false
  convertureChanged:boolean=false

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private eventService:EventService
  ) {
    this.eventForm = this.fb.group({
      titre: ['', [Validators.required, Validators.maxLength(150)]],
      type: ['', Validators.required],
      status: ['DRAFT'],
      description: ['', [Validators.required, Validators.maxLength(5000)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      localisation: ['', [Validators.required, Validators.maxLength(300)]]
    }, {
      validators: this.dateRangeValidator
    });
  }

  ngOnInit(): void {
    this.eventId = this.data.id || this.getEventIdFromRoute();
    this.loadEventTypesAndStatuses();
    this.loadEventData();
  }

  getEventIdFromRoute(): string {
    // Fallback if id is not in history.state
    const urlParts = window.location.pathname.split('/');
    return urlParts[urlParts.length - 1];
  }

  // initMap() {
  //   maptilersdk.config.apiKey = 'xSZNNaEoZln2VzUKpyS6';

  //   this.map = new maptilersdk.Map({
  //     container: 'map',
  //     style: maptilersdk.MapStyle.STREETS,
  //     center: [-7.5898, 33.5731],
  //     zoom: 10
  //   });

  //   this.map.on('click', (e: any) => {
  //     const lng = e.lngLat.lng;
  //     const lat = e.lngLat.lat;

  //     this.eventForm.get('localisation')?.setValue(`${lng},${lat}`);

  //     if (this.marker) {
  //       this.marker.setLngLat([lng, lat]);
  //     } else {
  //       this.marker = new maptilersdk.Marker().setLngLat([lng, lat]).addTo(this.map);
  //     }
  //   });
  // }

  loadEventData(): void {
    this.isLoading = true;
    
    this.http.get(environment.apiUrl + "api/events/" + this.eventId).subscribe({
      next: (event: any) => {
        console.log("Event loaded:", event);
        
        // Populate form with existing data
        this.eventForm.patchValue({
          titre: event.titre,
          type: event.type,
          status: event.status,
          description: event.description,
          startDate: this.formatDateTimeForInput(event.startDate),
          endDate: this.formatDateTimeForInput(event.endDate),
          localisation: event.localisation
        });
        this.existingCouvertureUrl=event.couverture
        this.existingLogoUrl=event.logo

        // Set existing media URLs
        

        // Set marker on map if location exists
        // if (event.localisation) {
        //   const [lng, lat] = event.localisation.split(',').map(Number);
        //   if (!isNaN(lng) && !isNaN(lat)) {
        //     this.map.setCenter([lng, lat]);
        //     this.marker = new maptilersdk.Marker().setLngLat([lng, lat]).addTo(this.map);
        //   }
        // }

        // Load existing images
        this.loadExistingImages();
        
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Error loading event:", err);
        alert("Erreur lors du chargement de l'événement");
        this.isLoading = false;
      }
    });
  }
  getImageUrl(path: string) {
  if (!path) return '/assets/default.png';

  // full external link
  if (path.startsWith('http')) return path;

  // backend uploads
  const url=environment.apiUrl.slice(0,-1)
  return url + path;
}

  loadExistingImages(): void {
    this.http.get<any[]>(environment.apiUrl + "api/events/images/" + this.eventId).subscribe({
      next: (images) => {
        this.existingImages = images;
        console.log("Existing images:", images);
      },
      error: (err) => {
        console.error("Error loading images:", err);
      }
    });
  }

  formatDateTimeForInput(dateTime: string): string {
    if (!dateTime) return '';
    const date = new Date(dateTime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  dateRangeValidator(form: FormGroup) {
    const startDate = form.get('startDate')?.value;
    const endDate = form.get('endDate')?.value;
    
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (end < start) {
        form.get('endDate')?.setErrors({ dateRange: true });
        return { dateRange: true };
      }
    }
    return null;
  }

  loadEventTypesAndStatuses(): void {
    this.http.get<EventTypesResponse>(environment.apiUrl + 'api/events/create')
      .subscribe({
        next: (data) => {
          this.eventTypes = data.eventsType;
          this.eventStatuses = data.eventStatus;
        },
        error: (error) => {
          console.error('Error loading event types and statuses:', error);
        }
      });
  }

  onLogoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedLogo = file;
      this.logoChanged=true
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.logoPreview = e.target.result;
        console.log(this.logoPreview);
        
      };
      reader.readAsDataURL(file);
    }
  }

  onCouvertureSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedCouverture = file;
      this.convertureChanged=true
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.couverturePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onImagesSelected(event: any): void {
    const files = Array.from(event.target.files) as File[];
    this.selectedImages = [...this.selectedImages, ...files];
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreviews.push(e.target.result);
      };
      reader.readAsDataURL(file);
    });
  }

  removeNewImage(index: number): void {
    this.selectedImages.splice(index, 1);
    this.imagePreviews.splice(index, 1);
  }

  removeExistingImage(imageId: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) {
      this.http.delete(environment.apiUrl + `api/events/${this.eventId}/images/${imageId}`)
        .subscribe({
          next: () => {
            this.existingImages = this.existingImages.filter(img => img.id !== imageId);
            console.log('Image supprimée avec succès');
          },
          error: (err) => {
            console.error('Erreur lors de la suppression:', err);
            alert('Erreur lors de la suppression de l\'image');
          }
        });
    }
  }

  removeLogo(): void {
    this.selectedLogo = null;
    this.logoChanged=true
    this.logoPreview = null;
  }

  removeCouverture(): void {
    this.selectedCouverture = null;
    this.convertureChanged=true
    this.couverturePreview = null;
  }

  removeExistingLogo(): void {
    this.existingLogoUrl = null;
    this.logoChanged=true
    // You might want to also send a request to delete it from server
  }

  removeExistingCouverture(): void {
    this.existingCouvertureUrl = null;
    this.convertureChanged=true
    // You might want to also send a request to delete it from server
  }

  onSubmit(): void {
    if (this.eventForm.invalid) {
      this.markFormGroupTouched(this.eventForm);
      return;
    }

    const formData = new FormData();
    
    // Add event JSON data
    const eventData = {
      titre: this.eventForm.value.titre,
      type: this.eventForm.value.type,
      status: this.eventForm.value.status,
      description: this.eventForm.value.description,
      startDate: this.eventForm.value.startDate,
      endDate: this.eventForm.value.endDate,
      localisation: this.eventService.getEventLocalisationForUpdate()
    };
    
    formData.append('event', new Blob([JSON.stringify(eventData)], {
      type: 'application/json'
    }));

    // Add logo file if new one selected
    if (this.selectedLogo) {
      formData.append('logo', this.selectedLogo);
    }

    // Add couverture file if new one selected
    if (this.selectedCouverture) {
      formData.append('couverture', this.selectedCouverture);
    }

    // Add new images
    this.selectedImages.forEach((image) => {
      formData.append('images', image);
    });

    // Submit update request
    this.http.put(environment.apiUrl + `api/events/${this.eventId}?logoChanged=${this.logoChanged}&convertureChanged=${this.convertureChanged}`, formData)
      .subscribe({
        next: (response) => {
          console.log('Event updated successfully:', response);
          alert('Événement mis à jour avec succès!');
          this.router.navigate(['/details'],{state:{id:this.eventId}});
        },
        error: (error) => {
          console.error('Error updating event:', error);
          alert('Erreur lors de la mise à jour. Veuillez réessayer.');
        }
      });
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.eventForm.get(fieldName);
    
    if (control?.hasError('required')) {
      return `${fieldName} est obligatoire`;
    }
    if (control?.hasError('maxlength')) {
      const maxLength = control.errors?.['maxlength'].requiredLength;
      return `${fieldName} doit contenir au maximum ${maxLength} caractères`;
    }
    if (control?.hasError('dateRange')) {
      return 'La date de fin doit être après la date de début';
    }
    
    return '';
  }
}