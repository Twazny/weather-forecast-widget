import { Component, Input, OnInit } from '@angular/core';
import { ForecastData } from '../forecast.service'

@Component({
  selector: 'app-weather-forecast',
  templateUrl: './weather-forecast.component.html',
  styleUrls: ['./weather-forecast.component.scss']
})
export class WeatherForecastComponent implements OnInit {
  @Input() data: ForecastData
  @Input() timeWindow = 8

  constructor() { }

  ngOnInit(): void {
  }

}
