import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { Auth } from '../../../Services/auth';
import { NgStyle } from '@angular/common';
import { Navbar } from '../../navbar/navbar';

@Component({
  selector: 'app-code',
  imports: [NgStyle,ReactiveFormsModule,Navbar],
  templateUrl: './code.html',
  styleUrl: './code.css'
})
export class Code {
  codeForm:FormGroup
  error_message:string=""
  success_message:String=""
   isSubmitting = false;
  constructor(private router:Router,private authService:Auth,private fb:FormBuilder){
    this.codeForm=fb.group({
       digit1: [''],
      digit2: [''],
      digit3: [''],
      digit4: [''],
      digit5: [''],
      digit6: [''],
    })
  }
  moveFocus(event: KeyboardEvent, nextInput?: HTMLInputElement, prevInput?: HTMLInputElement) {
  const input = event.target as HTMLInputElement;

  if (input.value.length >= 1 && nextInput && event.key !== 'Backspace') {
    nextInput.focus();
  } else if (event.key === 'Backspace' && !input.value && prevInput) {
    prevInput.focus();
  }
}

  onSubmitCode(){
    this.error_message=""
    this.success_message=""
    if (this.codeForm.invalid) {
      this.error_message = 'Please enter all six digits.';
      return;
    }

    const { digit1, digit2, digit3, digit4 ,digit5, digit6} = this.codeForm.value;
    const code = `${digit1}${digit2}${digit3}${digit4}${digit5}${digit6}`;

    if (code.length !== 6 || /\D/.test(code)) {
      this.error_message = 'The code must be six digits.';
      return;
    }

    this.isSubmitting = true;

    this.authService.checkcode({code}).subscribe({
      next: (res) => {
        this.success_message = 'Code verified successfully.';
        // cache the code for later steps if needed
        this.authService.changecode(code);
        // navigate to the next step, e.g. password reset form
        this.router.navigate(['/auth/password']);
      },
      error: (err) => {
        console.error('verification error', err);
        this.error_message =
          err?.error?.message || 'The code is incorrect or expired.';
      },
      complete: () => {
        this.isSubmitting = false;
      },
    });
  }
  ResendCode(){
  this.error_message=""
  this.success_message=""
  console.log("start it")
  if(!(this.authService.getEmail()=="")){
     console.log("email exist")
    this.authService.emailResetPassword({email:this.authService.getEmail()}).subscribe((res)=>{
      console.log('data',res)
      this.success_message="the code snets correctly"
    },(err)=>{
      console.log("full error",err)
      this.error_message=err.err
    })
  }
}
}
