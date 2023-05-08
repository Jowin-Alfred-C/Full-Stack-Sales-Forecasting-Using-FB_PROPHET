import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Home';


  constructor(private http: HttpClient,private router: Router) {}
  
  home(){
    this.router.navigate(['/home']);
  }

  logout(){
    this.router.navigate(['/login']);
  }

  
}
