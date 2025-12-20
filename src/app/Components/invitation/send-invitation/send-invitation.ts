import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { NgIf, NgStyle } from '@angular/common';

@Component({
  selector: 'app-send-invitation',
  imports: [ReactiveFormsModule,NgIf],
  templateUrl: './send-invitation.html',
  styleUrl: './send-invitation.css'
})
export class SendInvitation {
   invitationForm:FormGroup
   errMessage:String=""
   succsesseMessage:string=""
   @Input() eventId: any;
   loading:boolean=false

   constructor(private fb:FormBuilder,private http:HttpClient,private router:Router){
this.invitationForm=this.fb.group({
  eventId:[""],
  email:["",[
    Validators.required,
    Validators.email
  ]],
  firstName:["",[
    Validators.required,
  ]],
  lastName:["",[
    Validators.required,
  ]]
})
   }
   ngOnChanges() {
  if (this.eventId) {
    this.invitationForm.patchValue({ eventId: this.eventId });
  }
}

   onSubmit(){
    if(this.invitationForm.invalid){
      this.invitationForm.markAllAsTouched()
    }else{
      console.log(this.invitationForm.value);
      this.loading=true
this.http.post(environment.apiUrl+"api/invitations/send",this.invitationForm.value).subscribe((res)=>{
  this.succsesseMessage="Invitation Sent Succesfuly"
console.log("result", res);

this.loading=false
this.router.navigate(['/details'], { 
  state: { id: this.eventId }
});
},(err)=>{
console.log("err",err);
this.errMessage="An error happened while send invitation"
this.loading=false
})
    }
   }

}
