import { CommentStmt } from '@angular/compiler'
import { Injectable } from '@angular/core'

// export type ForecastData = HourData[]
export type ForecastData = {
    timestamp: Date,
    data: HourData[]
}[]

export interface HourData {
    timestamp: Date,
    forecast: WeatherForecast,
    temperature: number,
    rainfall: number,
    windDirection: WindDirection,
    windLevel: WindLevel,
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

export enum WindLevel {
    Weak = "Słaby",
    Medium = "Umiarkowany",
    Strong = "Silny"
}

export enum WindDirection { N, NE, E, SE, S, SW, W, NW }

@Injectable({
    providedIn: 'root'
})
export class WeatherForecastService {
    getForecast(): ForecastData {
        return this.generateFakeData()
    }

    private generateFakeData(): ForecastData {
        const now = new Date()
        now.setMinutes(0)
        now.setSeconds(0)
        now.setMilliseconds(0)

        let timestamps: string[] = []
        let data: ForecastData = []

        const forecastarray = ["RAINY",
            "HEAVY_RAIN",
            "SUNNY",
            "CLOUDY",
            "PARTIAL_CLOUDY"]

        const windlevelarray = ["Słaby", "Umiar.", "Silny"]

        let i = 0
        while (i < 3 * 24) {
            let a = new Date(now)
            a.setHours(now.getHours() + i)
            let b = new Date(a)
            b.setHours(0)
            i++

            const dayItem = data.find(day => {
                return day.timestamp.getTime() === b.getTime()
            })
            if (!dayItem) {
                data.push({
                    timestamp: b,
                    data: []
                })
            }
            const dayData = data.find(day => {
                return day.timestamp.getTime() === b.getTime()
            }).data

            dayData.push({
                timestamp: a,
                forecast: (forecastarray[Math.floor(Math.random() * forecastarray.length)]) as WeatherForecast,
                temperature: Math.floor(Math.random() * 22),
                rainfall: Math.floor(Math.random() * 2.5),
                windDirection: Math.floor(Math.random() * 8),
                windLevel: (windlevelarray[Math.floor(Math.random() * windlevelarray.length)]) as WindLevel,
                pressure: Math.floor(Math.random() * 10) + 1020,
                windSpeed: Math.floor(Math.random() * 25)
            })
        }

        return data
    }
}



