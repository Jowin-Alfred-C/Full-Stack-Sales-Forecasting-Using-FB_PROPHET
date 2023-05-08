import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  selectedfile: File = new File([], '');
  x: string = '';
  y: string = '';
  start_date : string='';
  end_date : string = '';
  frequency : string ='';
  forecast_period : string = '';


  constructor(private http: HttpClient,private router: Router) {}
  

  onFileSelected(event: any) {
    this.selectedfile = event.addedFiles[0];
    console.log(this.selectedfile);
  }

  remove_file(){
    this.selectedfile= new File([], '');
    console.log(this.selectedfile);
  }

  onSubmit(){
    console.log(this.selectedfile);
    const formData = new FormData();
    formData.append('file', this.selectedfile, this.selectedfile.name);
    formData.append('x', this.x);
    formData.append('y', this.y);
    formData.append('start_date', this.start_date);
    formData.append('end_date', this.end_date);
    formData.append('frequency', this.frequency);
    formData.append('forecast_period', this.forecast_period);


    console.log('Form data:', formData);
    console.log('Sending request...');
    
    let res: any ={};
    this.http.post('http://127.0.0.1:5000/upload',formData)
      .subscribe({
        next: (response: any) => {
          console.log(response);
          res= response;
        },
       error: (error) => {
        console.log(error);
      },
       complete: () => {
        this.router.navigate(['/forecast'], { state: { data: res } });
      }
    });

  }
}
