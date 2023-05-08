import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string='';
  password: string='';

  constructor(private http: HttpClient, private router: Router,private _snackBar: MatSnackBar) {}

  login() {
    const formData = new FormData();
    formData.append('email', this.email);
    formData.append('password', this.password);
    console.log('logging...')
    console.log(this.email)
    console.log(this.password)
    this.http.post('http://localhost:5000/login', formData)

      .subscribe(
        response => {
          console.log(response);
          this.router.navigate(['/home']);
        },
        error => {
          console.log(error);
          alert(error.error.error);
        }
      );
  }

}
