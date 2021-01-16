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

  tempYmax: number
  tempYmin: number
  tempYrange: number

  tempChartHeight = 200
  tempChartTopMargin = 50
  tempChartBottomMargin = 20
  tempYPxRange: number

  tempValues: number[] = []

  pressYmax: number
  pressYmin: number
  pressYrange: number

  pressChartHeight = 200
  pressChartTopMargin = 80
  pressChartBottomMargin = 40
  pressYPxRange: number

  pressValues: number[] = []

  days: string[]

  constructor() { }

  ngOnInit(): void {
    this.scaleTempYAxis()
    this.scalePressYAxis()
    const values = this.forecastData.map(hourData => {
      return hourData.timestamp.toLocaleDateString()
    })
    this.days = values.filter((value, index, self)=> {
      return self.indexOf(value) === index;
    })
  }

  private scaleTempYAxis(): void {
    this.forecastData.forEach(dayData => {
      this.tempValues.push(...dayData.data.map(hourData => {
        return hourData.temperature
      }))
    })

    this.tempYmax = Math.max(...this.tempValues)
    this.tempYmin = Math.min(...this.tempValues)

    this.tempYrange = this.tempYmax - this.tempYmin
    const margins = this.tempChartTopMargin + this.tempChartBottomMargin
    this.tempYPxRange = this.tempChartHeight - margins
  }

  private scalePressYAxis(): void {
    this.forecastData.forEach(dayData => {
      this.pressValues.push(...dayData.data.map(hourData => {
        return hourData.pressure
      }))
    })
    this.pressYmax = Math.max(...this.pressValues)
    this.pressYmin = Math.min(...this.pressValues)

    this.pressYrange = this.pressYmax - this.pressYmin
    const margins = this.pressChartTopMargin + this.pressChartBottomMargin
    this.pressYPxRange = this.pressChartHeight - margins
  }

  getLineX(i: number): number {
    return 0.5 * this.columnWidth + this.columnWidth * i
  }

  getTempLineY(value: number): number {
    return this.tempYPxRange -
      ((value - this.tempYmin) * this.tempYPxRange / this.tempYrange) +
      this.tempChartTopMargin
  }

  getPressLineY(value: number): number {
    return this.pressYPxRange -
      ((value - this.pressYmin) * this.pressYPxRange / this.pressYrange) +
      this.pressChartTopMargin
  }
}
