import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import pl from '@angular/common/locales/pl';
import { fromEvent, interval } from 'rxjs';
import { throttle } from 'rxjs/operators'
import { ForecastData, HourData } from '../forecast.service'

registerLocaleData(pl, 'pl');

@Component({
  selector: 'app-weather-forecast',
  templateUrl: './weather-forecast.component.html',
  styleUrls: ['./weather-forecast.component.scss']
})
export class WeatherForecastComponent implements OnInit, AfterViewInit, OnChanges {
  @Input('data') forecastData: ForecastData
  @Input() timeWindow = 8
  @Input() columnWidth = 120

  @ViewChild('scrollElement') scrollRef: ElementRef
  @ViewChild('overlay') overaly: ElementRef

  tempValues: number[] = []
  pressValues: number[] = []
  rainfallValues: number[] = []
  rainfallMax: number

  scrolling = false
  dragging = false
  scrollStartX: number
  currScrollLeft: number
  leftBounce = 0
  rightBounce = 0
  position = 0
  scrollPositions: number

  constructor() { }

  ngOnInit(): void {
    this.prepareValues()
  }

  ngAfterViewInit(): void {
    fromEvent(this.overaly.nativeElement, 'mousemove').pipe(
      throttle(event => interval(1))
    ).subscribe((event: MouseEvent) => this.onMouseMove(event))
  }

  ngOnChanges(): void {
    this.prepareValues()
  }

  onButtonScroll(dir: 'left' | 'right'): void {
    if (dir === 'left' && this.position > 0) {
      this.position--
    } else if (dir === 'right' && this.position < this.scrollPositions) {
      this.position++
    } else {
      return
    }
    this.scroll.scrollTo({
      left: this.columnWidth * this.position,
      behavior: 'smooth'
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
    if (this.dragging) {
      event.preventDefault()
      const x = event.pageX;
      const walk = x - this.scrollStartX;

      const diff = this.currScrollLeft - walk

      if (diff <= 0) {
        this.leftBounce = -diff
      } else {
        this.scroll.scrollLeft = diff
        this.leftBounce = 0
      }

      if (this.scroll.offsetWidth + diff > this.scroll.scrollWidth) {
        this.rightBounce = -walk
      } else {
        this.scroll.scrollLeft = diff
        this.rightBounce = 0
      }
    }
  }

  onMouseUp(event: MouseEvent): void {
    this.dragging = false
    this.leftBounce = 0
    this.rightBounce = 0
    this.scrollToNearest(event.pageX)

  }

  onMouseLeave(event: MouseEvent): void {
    if (this.dragging) {
      this.dragging = false
      this.leftBounce = 0
      this.rightBounce = 0
      this.scrollToNearest(event.pageX)
    }
  }

  private get scroll(): HTMLDivElement {
    return this.scrollRef.nativeElement
  }

  private scrollToNearest(pageX: number): void {
    const pos = Math.round(this.scroll.scrollLeft / this.columnWidth)
    this.scroll.scrollTo({ left: pos * this.columnWidth, behavior: 'smooth' })
    this.position = pos
  }

  private prepareValues(): void {
    this.forecastData.forEach(dayData => {
      dayData.data.forEach(hourData => {
        this.tempValues.push(hourData.temperature)
        this.pressValues.push(hourData.pressure)
        this.rainfallValues.push(hourData.rainfall)
      })
    })
    const max = Math.max(...this.rainfallValues)
    this.rainfallMax = max > 5 ? max : 5
    this.scrollPositions = this.rainfallValues.length - this.timeWindow
  }
}
