import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Login } from '../../Services/login';
import { NgStyle } from '@angular/common';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule,NgStyle,Navbar],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css'
})
export class LoginForm {
  loginForm: FormGroup;
  error_message:string="";

  constructor(private fb: FormBuilder,private loginservice:Login) {
    this.loginForm = this.fb.group({
      username: [''],
      password: ['']
    });
  }

  onSubmit() {
    this.error_message=""
    if (!(this.loginForm.get('username')?.value=="") && !(this.loginForm.get('password')?.value=="")){
      this.loginservice.login(this.loginForm.value).subscribe((data)=>{
        console.log(data)
        this.loginservice.saveTokensInLocalStorage(data)
        console.log(this.loginservice.getTokenFromLocalStorage())
        this.loginservice.goToDashboard()
      },
      (error) => {
        this.error_message=error.error;
        console.error('Error fetching:', error);
      })
  }else{
    this.error_message="username and password both required"
  }
  }

}
