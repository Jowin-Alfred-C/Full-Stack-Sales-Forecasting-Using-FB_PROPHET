import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForecastComponent } from './forecast/forecast.component';
import { VisualizationComponent } from './visualization/visualization.component';
import { HomeComponent } from './home/home.component';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
const routes: Routes = [
  { path: '', redirectTo: 'home-page', pathMatch: 'full' },
  {path:'forecast', component: ForecastComponent},
  {path: 'visualization', component :VisualizationComponent},
  {path: 'home', component :HomeComponent},
  {path: 'home-page', component :LandingpageComponent},
  {path: 'login' , component :LoginComponent},
  { path: 'register' , component: RegisterComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
