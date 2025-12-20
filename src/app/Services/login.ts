import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment'
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Login {
  private loginUrl="auth/login/";
  private refreshUrl="auth/refresh-token/"
  constructor(private http:HttpClient,private router: Router){
  }
  login(loginform:any):Observable<any>{
    return this.http.post(environment.apiUrl+this.loginUrl,loginform)
  }
  goToDashboard(){
    this.router.navigate(['/dashboard'])
  }
  saveTokensInLocalStorage(tokens:any){
    localStorage.setItem('token',tokens.token)
    localStorage.setItem('refreshToken',tokens.refreshToken)
  }
  getTokenFromLocalStorage(){
    return localStorage.getItem('token')
  }
  refreshToken(){
    return this.http.get(environment.apiUrl+this.refreshUrl)
  }
  logout(){
    localStorage.removeItem('token')
  }
}
