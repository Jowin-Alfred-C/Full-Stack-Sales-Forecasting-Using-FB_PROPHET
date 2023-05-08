import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.css']
})
export class ForecastComponent { 

  data: any;
  image1: any;
  image2: any;


  constructor(private http: HttpClient,private route: ActivatedRoute,private router: Router) {}
  
  ngOnInit() {
    this.data = history.state.data;
    this.image1 = 'data:image/png;base64,' + this.data.image1;
    this.image2 = 'data:image/png;base64,' + this.data.image2;
    
  }
  
  onclicked(){

    this.router.navigate(['/visualization'], { state: { data: this.data } });
    
  }

}
