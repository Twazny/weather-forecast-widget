import { Injectable } from '@angular/core'

export type ForecastData = HourData[]

export interface HourData {
    timestamp: Date,
    forecast: WeatherForecast,
    temperature: number,
    rainfall: number,
    windDirection: WindDirection,
    windLevel: 'Słaby' | 'Umiarkowany' | 'Silny',
    windSpeed: number,
    pressure: number
}

export enum WeatherForecast {
    Rainy = "RAINY",
    VeryRainy = "HEAVY_RAIN",
    Sunny = "SUNNY",
    Cloudy = "CLOUDY",
    PartialCloudy = "PARTIAL_CLOUDY"
}

export enum WindDirection {N,NW,W,SW,S,SE,NE}

@Injectable({
    providedIn: 'root'
})
export class WeatherForecastService {
    getForecast(): ForecastData {
        return this.testData
    }

    private testData: ForecastData = [
        {
            timestamp: new Date(2020,0,14,0,0,0),
            forecast: WeatherForecast.Cloudy,
            temperature: 7,
            rainfall: 0,
            windDirection: WindDirection.NW,
            windLevel: "Słaby",
            windSpeed: 14,
            pressure: 1014
        },
        {
            timestamp: new Date(2020,0,14,1,0,0),
            forecast: WeatherForecast.Rainy,
            temperature: 7,
            rainfall: 0.2,
            windDirection: WindDirection.W,
            windLevel: "Słaby",
            windSpeed: 22,
            pressure: 1013
        },
        {
            timestamp: new Date(2020,0,14,2,0,0),
            forecast: WeatherForecast.VeryRainy,
            temperature: 6,
            rainfall: 0.9,
            windDirection: WindDirection.NW,
            windLevel: "Umiarkowany",
            windSpeed: 26,
            pressure: 1012
        }
    ]
}



