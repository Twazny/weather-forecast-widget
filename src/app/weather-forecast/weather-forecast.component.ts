import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
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

  @ViewChild('scrollElement') scrollRef: ElementRef

  tempValues: number[] = []
  pressValues: number[] = []

  days: string[]

  scrolling = false
  dragging = false

  scrollStartX: number
  currScrollLeft: number

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

  onButtonScroll(dir: 'left' | 'right'): void {
    this.scroll.scrollBy({
      left: dir==='right' ? this.columnWidth : -this.columnWidth,
      behavior:'smooth'
    })
  }

  onScroll(event: Event): void {
    if (!this.scrolling) {
      this.scrolling = true
      setTimeout(() => {
        this.scrolling = false
      }, 1000)
    }
  }

  onMouseDown(event: MouseEvent): void {
    this.dragging = true
    this.scrollStartX = event.pageX - this.scroll.offsetLeft;
    this.currScrollLeft = this.scroll.scrollLeft;
  }

  onMouseMove(event: MouseEvent): void {
    if(this.dragging) {
      event.preventDefault()
      const x = event.pageX - this.scroll.offsetLeft;
      const walk = x - this.scrollStartX;
      this.scroll.scrollLeft = this.currScrollLeft - walk;
    }
  }

  onMouseUp(event: MouseEvent): void {
    this.dragging = false
    this.scrollToNearest(event.pageX)
  }

  onMouseLeave(event: MouseEvent): void {
    if(this.dragging) {
      this.dragging = false
      this.scrollToNearest(event.pageX)
    }
  }

  private scrollToNearest(pageX: number): void {
    const mod = this.scroll.scrollLeft%this.columnWidth
    const scrollBy = mod > 0.5*this.columnWidth ? this.columnWidth - mod : -mod
    this.scroll.scrollBy({left: scrollBy, behavior: 'smooth'})  
  }

  private get scroll(): HTMLDivElement {
    return this.scrollRef.nativeElement 
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
