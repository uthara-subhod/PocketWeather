import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  apiURL = 'https://api.openweathermap.org/data/2.5/'
  apiKey ='2e7e1d8fabd7c153330e11d1f13782d9'
  private geoNamesUrl = 'https://secure.geonames.org/searchJSON';
  private username = 'flowadmin';
  constructor(private http:HttpClient) { }

  getUserWeather(lat:any,lon:any){
    return this.http.get<any>(`${this.apiURL}weather?&lat=${lat}&lon=${lon}&APPID=${this.apiKey}&units=metric`)
  }
  getCityWeather(city:any){
    return this.http.get<any>(`${this.apiURL}weather?&q=${city}&APPID=${this.apiKey}&units=metric`)
  }

  getUserHourly(lat:any,lon:any){
    return this.http.get<any>(`${this.apiURL}forecast?&lat=${lat}&lon=${lon}&APPID=${this.apiKey}&units=metric`)
  }

  getCities(query: string) {
    return this.http.get<any>(`${this.geoNamesUrl}?name_startsWith=${query}&maxRows=10&username=flowadmin`);
  }

}
