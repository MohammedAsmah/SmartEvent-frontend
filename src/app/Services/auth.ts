import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private registerUrl ="auth/register/"
  private emailResetPasswordUrl="auth/forgot-password"
  private checkUrl="auth/check_code"
  private resetPasswordUrl="auth/reset-password"


  private code:String=""
  private email:any=""
  constructor(private http:HttpClient,private router:Router){

  }

  setEmail(email:any){
    this.email=email
    console.log("email",email)
  }
  getEmail(){
    return this.email
  }

  register(registerform:any):Observable<any>{
return  this.http.post(environment.apiUrl +this.registerUrl,registerform)
  }
  emailResetPassword(email:any):Observable<any>{
    return this.http.post(environment.apiUrl+this.emailResetPasswordUrl,email)
  }
  checkcode(code:any){
    return this.http.post(environment.apiUrl+this.checkUrl,code)
  }
  changePassword(newPassword:any){
    return this.http.post(environment.apiUrl+this.resetPasswordUrl,{newPassword:newPassword,code:this.code})
  }

  changecode(code:String){
    console.log(code)
    return this.code=code  
  }
  getCode(){
    return this.code
  }
  
}
