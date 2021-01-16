import { Component, Input, OnInit } from '@angular/core';
import { ForecastData, HourData } from '../forecast.service'

@Component({
  selector: 'app-weather-forecast',
  templateUrl: './weather-forecast.component.html',
  styleUrls: ['./weather-forecast.component.scss']
})
export class WeatherForecastComponent implements OnInit {
  @Input('data') forecastData: ForecastData
  @Input() timeWindow = 8
  @Input() columnWidth = 120

  tempValues: number[] = []
  pressValues: number[] = []

  days: string[]

  constructor() { }

  ngOnInit(): void {
    this.prepareTempValues()
    this.preparesPressValues()
    const values = this.forecastData.map(hourData => {
      return hourData.timestamp.toLocaleDateString()
    })
    this.days = values.filter((value, index, self)=> {
      return self.indexOf(value) === index;
    })
    this.preparesPressValues()
    this.prepareTempValues()
  }

  private prepareTempValues(): void {
    this.forecastData.forEach(dayData => {
      this.tempValues.push(...dayData.data.map(hourData => {
        return hourData.temperature
      }))
    })
  }

  private preparesPressValues(): void {
    this.forecastData.forEach(dayData => {
      this.pressValues.push(...dayData.data.map(hourData => {
        return hourData.pressure
      }))
    })
  }
}
