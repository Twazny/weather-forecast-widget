import { Component } from '@angular/core';
import { ForecastData, WeatherForecastService } from './forecast.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'weather-forecast';
  data: ForecastData
  constructor(
    private forecastService: WeatherForecastService
  ) {}

  ngOnInit() {
    this.data = this.forecastService.getForecast()
  }
}
