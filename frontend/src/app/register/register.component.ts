import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string='';
  email: string='';
  password: string='';
  confirmpassword: string='';

  constructor(private http: HttpClient, private router: Router) {}

  register() {
    const formData = new FormData();
    formData.append('username', this.username);
    formData.append('email', this.email);
    formData.append('password', this.password);
    formData.append('confirmpassword', this.confirmpassword);
    //const data = { username: this.username, email: this.email, password: this.password, confirm_password: this.confirmpassword };
    console.log('registering...')
    console.log(this.password)
    console.log(this.confirmpassword)
    this.http.post('http://localhost:5000/register', formData)
      .subscribe(
        response => {
          console.log(response);
          this.router.navigate(['/login']);
        },
        error => {
          console.log(error);
          alert(error.error.error);
        }
      );
  }


}
