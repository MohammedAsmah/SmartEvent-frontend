import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { LoginForm } from './Components/login-form/login-form';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,HttpClientModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
  standalone:true
})
export class App implements OnInit{
  protected readonly title = signal('Events_frontend');
  constructor(private router:Router,private http:HttpClient){
  }
  ngOnInit(): void {
      
  }
  
}


