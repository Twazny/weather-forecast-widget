import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit {
  @Input() values: number[]
  @Input() unit: string
  @Input() columnWidth: number
  @Input() color: string
  @Input() fontSize: string
  @Input() top: string
  
  ymax: number
  ymin: number
  yrange: number

  chartHeight = 200
  chartTopMargin = 50
  chartBottomMargin = 20
  yPxRange: number

  constructor() { }

  ngOnInit(): void {
    this.scaleYAxis()
  }

  private scaleYAxis(): void {
    this.ymax = Math.max(...this.values)
    this.ymin = Math.min(...this.values)

    this.yrange = this.ymax - this.ymin
    const margins = this.chartTopMargin + this.chartBottomMargin
    this.yPxRange = this.chartHeight - margins
  }

  getLineX(i: number): number {
    return 0.5 * this.columnWidth + this.columnWidth * i
  }

  getLineY(value: number): number {
    return this.yPxRange -
      ((value - this.ymin) * this.yPxRange / this.yrange) +
      this.chartTopMargin
  }

}
