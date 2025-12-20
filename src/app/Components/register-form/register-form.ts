import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Auth } from '../../Services/auth';
import { Router } from '@angular/router';
import { NgStyle } from '@angular/common';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-register-form',
  imports: [ReactiveFormsModule,NgStyle,Navbar],
  templateUrl: './register-form.html',
  styleUrl: './register-form.css'
})
export class RegisterForm {
  registerForm: FormGroup;
  error_message:string="";
  success_message: string = "";
  countdown: number = 0;
  
  private timeoutId: any;
  private intervalId: any;
  constructor(private fb:FormBuilder,private authService:Auth,private router:Router){
    this.registerForm= this.fb.group({
      firstName:[''],
      lastName:[''],
      email:[''],
      password:[''],
      passAgain:[''],
      username:[''],
      PhoneNumber:['']
    })
  }
  onSubmit(){
    this.error_message=""
    this.success_message = ""
    if(!(this.registerForm.get('firstName')?.value=="")&&!(this.registerForm.get('lastName')?.value=="")
    &&!(this.registerForm.get('email')?.value=="")&&!(this.registerForm.get('password')?.value=="")&&!(this.registerForm.get('passAgain')?.value=="")
  &&!(this.registerForm.get('username')?.value=="")&&!(this.registerForm.get('phoneNumber')?.value=="")){
    if(this.registerForm.get('password')?.value==this.registerForm.get('passAgain')?.value){
    this.authService.register(this.registerForm.value).subscribe({
      next: (data) => {
        console.log('Registration successful:', data);
        this.success_message="Registration successful!";
        this.startCountdownRedirect();
      },
      error: (error) => {
        console.log('Full error object:', error);
        
        // Handle different error response structures
        if (error.error) {
          // If error.error is a string
          if (typeof error.error === 'string') {
            this.error_message = error.error;
          }
          // If error.error is an object with a message property
          else if (error.error.message) {
            this.error_message = error.error.message;
          }
          // If error.error is an object, stringify it
          else {
            this.error_message = JSON.stringify(error.error);
          }
        }
        // Fallback to error.message or status text
        else if (error.message) {
          this.error_message = error.message;
        }
        else if (error.statusText) {
          this.error_message = error.statusText;
        }
        else {
          this.error_message = "Registration failed. Please try again.";
        }
      }
    })}else{
      this.error_message="you have a mistke in you password"
    }
  }else{
    this.error_message="all fields are required"
  }
  }

  // Countdown before redirect
  startCountdownRedirect() {
    this.countdown = 3; // Start from 3 seconds
    
    this.intervalId = setInterval(() => {
      this.countdown--;
      
      if (this.countdown === 0) {
        clearInterval(this.intervalId);
        this.router.navigate(['/auth/login']);
      }
    }, 1000);
  }
  
  // Clean up when component is destroyed
  ngOnDestroy() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
