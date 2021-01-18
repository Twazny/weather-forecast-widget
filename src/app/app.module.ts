import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { WeatherForecastComponent } from './weather-forecast/weather-forecast.component';
import { WindDirectionPipe } from './wind-direction.pipe';
import { LineChartComponent } from './weather-forecast/line-chart/line-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    WeatherForecastComponent,
    WindDirectionPipe,
    LineChartComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
