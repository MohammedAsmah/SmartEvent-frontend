import { Component } from '@angular/core';
import { Navbar } from '../../navbar/navbar';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgStyle } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '../../../Services/auth';

@Component({
  selector: 'app-password',
  imports: [Navbar,ReactiveFormsModule,NgStyle],
  templateUrl: './password.html',
  styleUrl: './password.css'
})
export class Password {
  success_message:String=""
  error_message:String=""
  passwordForm:FormGroup

  constructor(private router:Router,private authService:Auth,private pw:FormBuilder){
    this.passwordForm=pw.group({
      newPassword:[''],
      confirmPassword:['']

    })
  }
  onSubmitPassword(){
    this.success_message=""
    this.error_message=""
    if(!(this.passwordForm.get('newPassword')?.value=="") && !(this.passwordForm.get('confirmPassword')?.value=="")){
      if(this.passwordForm.get('newPassword')?.value==this.passwordForm.get('confirmPassword')?.value){
      this.authService.changePassword(this.passwordForm.get('newPassword')?.value).subscribe((res)=>{
        this.success_message="password changes successfully"
        console.log("data",res)
        this.router.navigate(['auth/login'])
      },
    (err)=>{
      console.log("full error",err)
      this.error_message=err.err
    })
    }else{
      this.error_message="your confirnm password should be the same"
    }
  }else{
    this.error_message="all fileds are required"
  }
  }
}
