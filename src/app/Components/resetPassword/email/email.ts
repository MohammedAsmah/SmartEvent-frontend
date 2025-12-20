import { Component } from '@angular/core';
import { Navbar } from '../../navbar/navbar';
import { Router } from '@angular/router';
import { Auth } from '../../../Services/auth';
import { FormBuilder, FormGroup, NgForm, ReactiveFormsModule } from '@angular/forms';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-email',
  imports: [Navbar,ReactiveFormsModule,NgStyle],
  templateUrl: './email.html',
  styleUrl: './email.css'
})
export class Email {
  emailForm:FormGroup
error_message:string="";
success_message:String=""
constructor(private router:Router,private authservice:Auth,private fb:FormBuilder){
  this.emailForm=this.fb.group({
    email:['']
  })
}
onsubmit(){
  this.error_message=""
  console.log('here is it ')
  if(!(this.emailForm.get('email')?.value=="")){
    this.authservice.emailResetPassword(this.emailForm.value).subscribe((res)=>{
      console.log('data',res)
      this.success_message="the code snets correctly"
      this.authservice.setEmail(this.emailForm.get('email')?.value)
      this.router.navigate(['auth/code'])
    },(err)=>{
      console.log("full error",err)
      this.error_message=err.err
    })
  }
}
}
