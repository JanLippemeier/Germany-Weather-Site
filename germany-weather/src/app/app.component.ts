import { Component } from '@angular/core';
import { InfoService } from './api/services';
import { lastValueFrom } from 'rxjs';
import { CityInfo } from './api/models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'germany-weather';
  foundCities: CityInfo[] = [];
  city!: CityInfo;
  cityColumns = ["name","postal_code","population","state_name"]
  savedCities: CityInfo[] = [];
  constructor(
    private infoService: InfoService
  ){}
  ngOnInit(){
    if(Boolean(localStorage.getItem("geolocationAllowed"))){
      this.useCurrentLocation();
    }
    let savedCities = localStorage.getItem("savedCities");
    if (typeof savedCities == "string"){
      this.savedCities = JSON.parse(savedCities)
    }
  }
  searchCity(value:string){
    let params = {}
    if (/^\d+$/.test(value)){
      params = {postal_code:value}
    }
    else{
      params = {city_name:value}
    }
    lastValueFrom(this.infoService.citiesInfoCitiesGet(params)).then(cityInfo=>{
      this.foundCities = cityInfo.slice(0,40);
      if(this.foundCities.length){
        this.city = this.foundCities[0];
      }
    })
  }
  useCurrentLocation(){
    navigator.geolocation.getCurrentPosition((position) => {
      localStorage.setItem("geolocationAllowed","true")
      lastValueFrom(this.infoService.citiesInfoCitiesGet({latitude:position.coords.latitude,longitude:position.coords.longitude})).then(cityInfo=>{
        this.foundCities = cityInfo.slice(0,40);
        this.city = this.foundCities[0];
      })
    })
  }
  addCity(){
    if(!this.savedCities.map(c=>c.postal_code).includes(this.city.postal_code)){
      this.savedCities.push(this.city);
      this.saveCities();
    }
  }
  saveCities(){
    localStorage.setItem("savedCities",JSON.stringify(this.savedCities));
  }
  removeCity(postal_code:number){
    this.savedCities = this.savedCities.filter(c=>c.postal_code!=postal_code);
    this.saveCities();
  }
}
