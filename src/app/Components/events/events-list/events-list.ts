import { HttpClient } from '@angular/common/http';
import { Component, OnInit, signal, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { DatePipe, NgClass, NgFor } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

interface EventTypesResponse {
  eventsType: string[];
  eventStatus: string[];
}

@Component({
  selector: 'app-events-list',
  imports: [DatePipe,NgClass,NgFor,ReactiveFormsModule],
  templateUrl: './events-list.html',
  styleUrl: './events-list.css'
})
export class EventsList implements OnInit {
private url="api/events"
apiUrl= 'http://localhost:8080'
events=signal<any>([]);
pageable=signal<any>({});
eventTypes: string[] = [];
  eventStatuses: string[] = [];
pageNumber=signal<number>(0);
totalPages=signal<number>(0);
filterForm:FormGroup;
constructor(private http:HttpClient,private router:Router,private fb: FormBuilder){
this.filterForm= this.fb.group({
      type:[""],
      status:[""],
      start:[""],
      end:[""]
    })
}
ngOnInit(): void {
    this.loadEvents()
}
loadEvents(){
this.http.get<any>(environment.apiUrl+this.url+`?page=${this.pageNumber()}`+"&size=12").subscribe((res)=>{
      console.log("the eventrs loaded: ",res.content," -------  pageable:",res.pageable);
      this.events.set(res.content)
      this.pageable.set(res.pageable)
      this.totalPages.set(res.totalPages)
    },
    (err)=>{
      console.log(err);
      
    }
  )
  this.loadEventTypesAndStatuses()
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
previousPage() {
    if (this.pageNumber() > 0) {
      this.pageNumber.set(this.pageNumber()-1);
      this.loadEvents()
    }
  }

  nextPage() {
    let tPages=this.totalPages()
    if (this.pageNumber() < tPages  - 1) {
      this.pageNumber.set(this.pageNumber()+1);
      console.log("presed");
      
      this.loadEvents()
    }
  }
  getImageUrl(path: string) {
  if (!path) return '/assets/default.png';

  // full external link
  if (path.startsWith('http')) return path;

  // backend uploads
  return this.apiUrl + path;
}
ShowDetials(id :String){
  console.log(id);
  
    this.router.navigate(['/details'], { 
  state: { id: id }
});
  
}
filter(){
  this.pageNumber.set(0)
  console.log("the start and end date :::::::::::::::::::::::::;",this.filterForm.get("start")?.value,this.filterForm.get("end")?.value);
  
this.http.get<any>(environment.apiUrl+this.url+"/filter"+`?page=${this.pageNumber()}`+"&size=12"+`&type=${this.filterForm.get("type")?.value}`+`&status=${this.filterForm.get('status')?.value}`+`&start=${this.filterForm.get("start")?.value}`+`&end=${this.filterForm.get('end')?.value}`).subscribe((res)=>{
      console.log("the filtred events loaded: ",res.content," -------  pageable:",res.pageable);
      this.events.set(res.content)
      this.pageable.set(res.pageable)
      this.totalPages.set(res.totalPages)
    },
    (err)=>{
      console.log(err);
      
    }
  )
}
isFilterOpen = false;

toggleFilter() {
  this.isFilterOpen = !this.isFilterOpen;
}
resetFilterForm() {
  this.filterForm.reset({
    type: "",
    status: "",
    start: "",
    end: ""
  });
}

}
