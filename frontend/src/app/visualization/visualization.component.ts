import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-visualization',
  templateUrl: './visualization.component.html',
  styleUrls: ['./visualization.component.css']
})
export class VisualizationComponent {
   metric:any;
   keys = Object.keys;
  
  constructor(private http: HttpClient,private route: ActivatedRoute) {}

  ngOnInit() {
    this.metric = history.state.data.metric;
  }
  
}
