import { Component } from '@angular/core';
import { Login } from '../../Services/login';
import { Router, RouterOutlet } from '@angular/router';
import { Header } from '../header/header';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-layouts',
  imports: [RouterOutlet,Header,Sidebar],
  templateUrl: './layouts.html',
  styleUrl: './layouts.css'
})
export class Layouts {

}
