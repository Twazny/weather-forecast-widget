import { AfterViewInit, Component, ElementRef, Input, NgZone, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import pl from '@angular/common/locales/pl';
import { fromEvent, interval } from 'rxjs';
import { throttle } from 'rxjs/operators'
import { ForecastData } from '../forecast.service'

registerLocaleData(pl, 'pl');

@Component({
  selector: 'app-weather-forecast',
  templateUrl: './weather-forecast.component.html',
  styleUrls: ['./weather-forecast.component.scss']
})
export class WeatherForecastComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Input('data') forecastData: ForecastData

  @ViewChild('scrollElement') scrollRef: ElementRef
  @ViewChild('overlay') overaly: ElementRef

  columnWidth = 120
  timeWindow = 8
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

  resizeObserver: ResizeObserver

  constructor(
    private hostRef: ElementRef,
    private zone: NgZone
  ) { }

  ngOnInit(): void {
    this.prepareValues()
    this.resizeObserver = new ResizeObserver(entries => {
      this.zone.run(() => {
        const hostWidth = entries[0].contentRect.width
        const contentWidth = hostWidth - 140
        this.timeWindow = Math.floor(contentWidth / this.columnWidth)
        this.scrollPositions = this.rainfallValues.length - this.timeWindow
      })
    })
    this.resizeObserver.observe(this.hostRef.nativeElement)
  }

  ngAfterViewInit(): void {
    fromEvent(this.overaly.nativeElement, 'mousemove').pipe(
      throttle(event => interval(1))
    ).subscribe((event: MouseEvent) => this.onMouseMove(event))
  }

  ngOnChanges(): void {
    this.prepareValues()
  }

  ngOnDestroy(): void {
    this.resizeObserver.unobserve(this.hostRef.nativeElement)
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
    if (this.scrolling) { return }
    this.scrolling = true
    setTimeout(() => {
      this.scrolling = false
    }, 1000)
  }

  onMouseDown(event: MouseEvent): void {
    this.dragging = true
    this.scrollStartX = event.pageX - this.scroll.offsetLeft;
    this.currScrollLeft = this.scroll.scrollLeft;
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.dragging) { return }
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

    const rw = this.scroll.offsetWidth + diff + this.rightBounce
    if (rw > this.scroll.scrollWidth) {
      this.rightBounce = rw - this.scroll.scrollWidth
    } else {
      this.scroll.scrollLeft = diff
      this.rightBounce = 0
    }
  }

  onMouseUp(event: MouseEvent): void {
    this.stopDrag()
  }

  onMouseLeave(event: MouseEvent): void {
    if (!this.dragging) { return }
    this.stopDrag()
  }

  private get scroll(): HTMLDivElement {
    return this.scrollRef.nativeElement
  }

  private stopDrag(): void {
    this.dragging = false
    this.leftBounce = 0
    this.rightBounce = 0
    this.scrollToNearest()
  }

  private scrollToNearest(): void {
    let pos = Math.round(this.scroll.scrollLeft / this.columnWidth)
    this.scroll.scrollTo({ left: pos * this.columnWidth, behavior: 'smooth' })
    if (pos > this.scrollPositions) {
      pos = this.scrollPositions
    }
    this.position = pos
  }

  private prepareValues(): void {
    this.rainfallValues = []
    this.pressValues = []
    this.tempValues = []
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
