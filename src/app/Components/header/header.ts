import { Component } from '@angular/core';
import { Login } from '../../Services/login';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  constructor( private loginserivce:Login, private router:Router){}
  logout(){
    console.log("logouted succesfully",localStorage.getItem('token'))
    this.loginserivce.logout()
  this.router.navigate(['auth/login'])

  }

}
