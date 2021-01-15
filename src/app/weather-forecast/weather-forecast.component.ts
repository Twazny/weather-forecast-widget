import { Component, Input, OnInit } from '@angular/core';
import { ForecastData, HourData } from '../forecast.service'

@Component({
  selector: 'app-weather-forecast',
  templateUrl: './weather-forecast.component.html',
  styleUrls: ['./weather-forecast.component.scss']
})
export class WeatherForecastComponent implements OnInit {
  @Input() data: ForecastData
  @Input() timeWindow = 8
  @Input() columnWidth = 120

  tempYmax: number
  tempYmin: number
  tempYrange: number

  tempChartHeight = 200
  tempChartTopMargin = 50
  tempChartBottomMargin = 20
  tempYPxRange: number

  pressYmax: number
  pressYmin: number
  pressYrange: number

  pressChartHeight = 200
  pressChartTopMargin = 80
  pressChartBottomMargin = 40
  pressYPxRange: number

  constructor() { }

  ngOnInit(): void {
    this.scaleTempYAxis()
    this.scalePressYAxis()
  }

  private scaleTempYAxis(): void {
    const values = this.data.map(hourData => {
      return hourData.temperature
    })
    this.tempYmax = Math.max(...values)
    this.tempYmin = Math.min(...values)

    this.tempYrange = this.tempYmax - this.tempYmin
    const margins = this.tempChartTopMargin + this.tempChartBottomMargin
    this.tempYPxRange = this.tempChartHeight - margins
  }

  private scalePressYAxis(): void {
    const values = this.data.map(hourData => {
      return hourData.pressure
    })
    this.pressYmax = Math.max(...values)
    this.pressYmin = Math.min(...values)

    this.pressYrange = this.pressYmax - this.pressYmin
    const margins = this.pressChartTopMargin + this.pressChartBottomMargin
    this.pressYPxRange = this.pressChartHeight - margins
  }

  getLineX(i: number): number {
    return 0.5 * this.columnWidth + this.columnWidth * i
  }

  getTempLineY(hourData: HourData): number {
    return this.tempYPxRange -
      ((hourData.temperature - this.tempYmin) * this.tempYPxRange / this.tempYrange) +
      this.tempChartTopMargin
  }

  getPressLineY(hourData: HourData): number {
    return this.pressYPxRange -
      ((hourData.pressure - this.pressYmin) * this.pressYPxRange / this.pressYrange) +
      this.pressChartTopMargin
  }
}
