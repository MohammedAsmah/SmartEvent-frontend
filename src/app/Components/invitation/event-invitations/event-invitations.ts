import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { SendInvitation } from '../send-invitation/send-invitation';

@Component({
  selector: 'app-event-invitations',
  standalone: true,
  imports: [CommonModule,SendInvitation],
  templateUrl: './event-invitations.html',
  styleUrl: './event-invitations.css'
})
export class EventInvitations implements OnInit {

  eventInvitation: any[] = [];
  eventId: string | null = history.state?.id ?? null;
  errorMessage = '';
  deleteMessage=""
  deleteErr=""
  apiUrl="http://localhost:8080/"

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    if (this.eventId) {
      this.loadInvitation();
    } else {
      this.errorMessage = 'Event ID not found';
    }
  }

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
    console.log("clicked hhhhhhhhhhhhhhhhhhh");
    
    if (invitationForm) {
    invitationForm.style.display = 'flex';
  }
  }
  loadInvitation(): void {
    this.http
      .get<any[]>(environment.apiUrl + `api/invitations/event/${this.eventId}`)
      .subscribe({
        next: (res) => {
          this.eventInvitation = res;
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'An error while fetching the invitations';
        }
      });
  }
  delteInvitation(invitationId:string):void{
    this.http.delete(environment.apiUrl+`api/invitations/${invitationId}`).subscribe((res)=>{
      console.log("invitation deleted succesfully",res);
      this.deleteMessage="invitation deleted succesfully"
      setTimeout(() => {
          this.eventInvitation = this.eventInvitation.filter(
            inv => inv.id !== invitationId
            
          );
        this.deleteMessage=""}, 700);
      
    },(err)=>{
      console.log("err whilre dleeting the invitation",err);
      this.deleteErr="err whilre dleeting the invitation"
      setTimeout(() => {
        this.deleteErr=""}, 700);
    })
  }
}
