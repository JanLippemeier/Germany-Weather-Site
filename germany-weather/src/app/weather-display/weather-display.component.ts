import { Component, Input, OnChanges } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { CityInfo } from '../api/models';
import { WeatherRecord } from '../weather-api/models';
import { WeatherService } from '../weather-api/services';
import {Chart} from "chart.js"

@Component({
  selector: 'app-weather-display',
  templateUrl: './weather-display.component.html',
  styleUrls: ['./weather-display.component.scss']
})
export class WeatherDisplayComponent implements OnChanges {
  @Input("city") city!: CityInfo;
  weatherWeek: weatherForecast[] = [];
  selectedDay!: weatherForecast;
  weatherResult: WeatherRecord[] = [];
  weatherChart!: Chart<"line", (number | null | undefined)[], any>;

  constructor(
    private weatherService: WeatherService
  ) { }

  ngOnChanges(): void {
    let weekdays = ["Sonntag","Montag","Dienstag","Mitwoch","Donnerstag","Freitag","Samstag"]
    let startDate = new Date();
    let   endDate = new Date(startDate.getTime()+1000*3600*24*8);
    let startDateString = startDate.toISOString().substring(0,10);
    let   endDateString =   endDate.toISOString().substring(0,10);
    this.weatherWeek = [];
    lastValueFrom(this.weatherService.getWeather({
      date:startDateString,
      last_date:endDateString,
      lat:this.city.latitude,
      lon:this.city.longitude
    })).then((weatherResult)=>{
      if(weatherResult.weather){
        this.weatherResult = weatherResult.weather;
      }
      weatherResult.weather = weatherResult.weather?.slice(0,-1);
      let weatherForecast: Record<string,WeatherRecord[]> = {};
      weatherResult.weather?.forEach(weatherRecord => {
        weatherForecast[weatherRecord.timestamp.substring(0,10)] = [];
      });
      weatherResult.weather?.forEach(weatherRecord=>{
        weatherForecast[weatherRecord.timestamp.substring(0,10)].push(weatherRecord);
      })
      for(let key in weatherForecast){
        let meanCloudCover = weatherForecast[key].map(f=>f.cloud_cover).filter(Number).map(Number).reduce((a,b)=>a+b,0) / weatherForecast[key].length;
        let precipitation = weatherForecast[key].map(forecast=>forecast.precipitation).filter(Number).map(Number).reduce((a,b)=>a+b,0);
        let date = new Date(key.substring(0,10))
        this.weatherWeek.push({
          forecast: weatherForecast[key],
          date: date.toLocaleDateString(),
          maxTemp: Math.max(...weatherForecast[key].map(forecast=>forecast.temperature).filter(Number).map(Number)),
          minTemp: Math.min(...weatherForecast[key].map(forecast=>forecast.temperature).filter(Number).map(Number)),
          precipitation: precipitation,
          precipitationHours: weatherForecast[key].map(forecast=>forecast.precipitation).filter(Number).map(Number).length,
          meanCloudCover: meanCloudCover,
          icon: this.getIcon(precipitation, meanCloudCover, weatherForecast[key]),
          day: weekdays[date.getDay()]
        })
      }
      if(!this.selectedDay){
        this.selectedDay = this.weatherWeek[0];
      }
      this.drawGraph();
    })

      
  }
  getIcon(precipitation:number, meanCloudCover:number, forecasts:WeatherRecord[]){
    if(forecasts.map(f=>f.icon).filter(String).map(String).filter(i=>i=="thunderstorm").length){
      return "thunderstorm";
    }
    if (precipitation > 3){
      return "rain";
    }
    if(meanCloudCover > 75){
      return "cloudy"
    }
    if(meanCloudCover > 50){
      return "partly-cloudy-day"
    }

    return "clear-day"
  }
  drawGraph(){
    if (this.weatherChart){
      this.weatherChart.destroy();
    }
    let yellow = getComputedStyle(document.documentElement).getPropertyValue('--yellow');
    let yellow_light = getComputedStyle(document.documentElement).getPropertyValue('--yellow-light');
    let blue = getComputedStyle(document.documentElement).getPropertyValue('--blue');
    let blue_light = getComputedStyle(document.documentElement).getPropertyValue('--blue-light');
    this.weatherChart = new Chart("weather-forecast", {
      type: 'line',
      data: {
        labels: this.selectedDay.forecast.map(f=>f.timestamp.substring(11,16)),
        datasets: [
          {
            label: 'Regen',
            yAxisID: "B",
            data: this.selectedDay.forecast.map(f=>f.precipitation),
            fill: true,
            borderColor: blue,
            backgroundColor: blue_light,
            pointBackgroundColor: blue,
            tension: 0.2
          },
          {
            label: 'Temperatur',
            yAxisID: "A",
            data: this.selectedDay.forecast.map(f=>f.temperature),
            fill: true,
            borderColor: yellow,
            backgroundColor: yellow_light,
            pointBackgroundColor: yellow,
            tension: 0.1
          }
        ]
      },
      options: {
        scales: {
          A: {
            type: 'linear',
            position: 'left',
            suggestedMax: Math.max(...this.weatherResult.map(f=>f.temperature).filter(Number).map(Number))
          },
          B: {
            type: 'linear',
            position: 'right',
            suggestedMax: Math.max(...this.weatherResult.map(f=>f.precipitation).filter(Number).map(Number))
          }
      }
      }
    })
  }
}
export interface weatherForecast{
  forecast: WeatherRecord[];
  date: string;
  maxTemp: number;
  minTemp: number;
  precipitation: number;
  precipitationHours: number;
  meanCloudCover: number;
  icon: string;
  day: string;
}