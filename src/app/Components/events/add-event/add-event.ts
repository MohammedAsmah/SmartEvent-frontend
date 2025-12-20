import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import * as maptilersdk from '@maptiler/sdk';


interface EventType {
  name: string;
}

interface EventStatus {
  name: string;
}

interface EventTypesResponse {
  eventsType: string[];
  eventStatus: string[];
}

@Component({
  selector: 'app-add-event',
  imports: [ReactiveFormsModule,NgFor,NgIf],
  templateUrl: './add-event.html',
  styleUrl: './add-event.css'
})
export class AddEvent {
 eventForm!: FormGroup;
  eventTypes: string[] = [];
  eventStatuses: string[] = [];
  selectedLogo: File | null = null;
  selectedCouverture: File | null = null;
  selectedImages: File[] = [];
  
  logoPreview: string | null = null;
  couverturePreview: string | null = null;
  imagePreviews: string[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadEventTypesAndStatuses();
    this.initMap(); 
  }
  map!: maptilersdk.Map;
marker: any = null;

initMap() {
  maptilersdk.config.apiKey = 'xSZNNaEoZln2VzUKpyS6';

  this.map = new maptilersdk.Map({
    container: 'map',
    style: maptilersdk.MapStyle.STREETS,
    center: [-7.5898, 33.5731], // Default: Casablanca
    zoom: 10
  });

  // CLICK ON MAP TO SELECT LOCATION
  this.map.on('click', (e: any) => {
    const lng = e.lngLat.lng;
    const lat = e.lngLat.lat;

    // Update form control
    this.eventForm.get('localisation')?.setValue(`${lng},${lat}`);

    // Add or move marker
    if (this.marker) {
      this.marker.setLngLat([lng, lat]);
    } else {
      this.marker = new maptilersdk.Marker().setLngLat([lng, lat]).addTo(this.map);
    }
  });
}


  initializeForm(): void {
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
    this.http.get<EventTypesResponse>('http://localhost:8080/api/events/create')
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
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.logoPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onCouvertureSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedCouverture = file;
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

  removeImage(index: number): void {
    this.selectedImages.splice(index, 1);
    this.imagePreviews.splice(index, 1);
  }

  removeLogo(): void {
    this.selectedLogo = null;
    this.logoPreview = null;
  }

  removeCouverture(): void {
    this.selectedCouverture = null;
    this.couverturePreview = null;
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
      type: this.eventForm.value.type,  // ✅ Just the string value like "CONFERENCE"
    status: this.eventForm.value.status,  // ✅ Just the string value like "DRAFT"
      description: this.eventForm.value.description,
      startDate: this.eventForm.value.startDate,
      endDate: this.eventForm.value.endDate,
      localisation: this.eventForm.value.localisation
    };
    
    formData.append('event', new Blob([JSON.stringify(eventData)], {
      type: 'application/json'
    }));

    // Add logo file
    if (this.selectedLogo) {
      formData.append('logo', this.selectedLogo);
    }

    // Add couverture file
    if (this.selectedCouverture) {
      formData.append('couverture', this.selectedCouverture);
    }

    // Add images array
    this.selectedImages.forEach((image, index) => {
      formData.append('images', image);
    });

    // Submit form
    this.http.post('http://localhost:8080/api/events', formData)
      .subscribe({
        next: (response) => {
          console.log('Event created successfully:', response);
          this.router.navigate(['/events']);
        },
        error: (error) => {
          console.error('Error creating event:', error);
          alert('Error creating event. Please try again.');
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