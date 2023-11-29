import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { WeatherService } from './weather.service';
import { FormControl } from '@angular/forms';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  @ViewChild('input') input!: ElementRef;
  title = 'Passwordgenerator';
  city = ''
  weatherData: any
  like = 0
  main = ''
  query = ''
  date = Date.now()
  temperature = 0
  cloudCover: any
  visibility = 0
  humidity = 0
  wind = 0
  icon = ''
  min = 0
  
  max = 0
  searchControl = new FormControl('');
  suggestedCities: any[] = [];
  constructor(private weather: WeatherService) { }
  ngOnInit(): void {
    this.getUserLocation()
  }
  ngAfterViewInit() {
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        filter(Boolean),
        debounceTime(150),
        distinctUntilChanged(),
        tap((text) => {
          if(this.input.nativeElement.value.trim()!=''){
            this.weather.getCities(this.input.nativeElement.value).subscribe({
              next:(cities)=>{
                this.suggestedCities=cities.geonames
                console.log(this.suggestedCities)
              },
              error:(err)=>{
                console.log(err)
              }
            })
          }else{
            this.suggestedCities=[]
          }
        })
      )
      .subscribe();
  }
  getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          // Now that you have the user's location, you can use it to fetch weather data
          this.getWeatherData(latitude, longitude);
        },
        (error) => {
          console.error(`Error getting location: ${error.message}`);
          // Handle errors or provide a default location
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      // Handle the case where geolocation is not supported
    }
  }

  getWeatherData(latitude: number, longitude: number) {

    // Make an HTTP request to the weather API
    this.weather.getUserWeather(latitude, longitude).subscribe({
      next: (data: any) => {
        this.city = data.name
        this.temperature = Math.floor(data.main.temp)
        this.cloudCover = data.weather[0].description
        this.icon = data.weather[0].icon
        this.like = Math.floor(data.main.feels_like)
        this.humidity = data.main.humidity
        this.main = data.weather[0].main
        this.visibility = data.visibility / 1000
        this.wind = data.wind.speed
        this.min = Math.floor(data.main.temp_min)
        this.max = Math.ceil(data.main.temp_max)
        console.log('Weather Data:', data);
      },
      error: (error) => {
        console.error('Error fetching weather data:', error);
      }
    });
    this.weather.getUserHourly(latitude, longitude).subscribe({
      next: (data) => {
        this.weatherData = data.list
        console.log(this.weatherData)
      }
    })
  }

  get Background() {
    let url = ''
    switch (this.main) {
      case 'Thunderstorm':
        url = 'https://i.gifer.com/DNx.gif';
        break;
      case 'Drizzle':
        url = 'https://media.tenor.com/qj2JPzyAttkAAAAC/rain-drops-rain.gif';
        break;
      case 'Rain':
        url = 'https://64.media.tumblr.com/8ce3b41ddedd50d7b5dcd34b7e6b4afa/92ecd3c1567b061a-fa/s640x960/e3e6035c3645af9f3e622f57cb85a5b8efba33d8.gif';
        break;
      case 'Clouds':
        url = 'https://i.makeagif.com/media/8-08-2017/U8cAor.gif';
        break;
      case 'Snow':
        url = 'https://i.pinimg.com/originals/7d/7c/79/7d7c79f57f2bf8fc2b43b9a5e5a2a96b.gif';
        break;
      case 'Atmosphere':
        url = 'https://cdn.dribbble.com/users/933737/screenshots/2580726/400300.gif';
        break;
      case 'Clear':
        url = 'https://i.pinimg.com/originals/80/e5/b5/80e5b5070a9a15dab79fe8d8f27378cc.gif';
        break;
      case 'Haze':
        url='https://media.tenor.com/uwrDXgOernIAAAAC/aesthetic-white.gif'
        break;
    }
    return url
  }

  submit() {
    this.query = this.query.trim()
    if (this.query == '') {
      alert('Please enter a city!')
      return
    }
    console.log("hey", this.query)
    this.weather.getCityWeather(this.query).subscribe({
      next: (data: any) => {
        this.city = data.name
        this.temperature = Math.floor(data.main.temp)
        this.cloudCover = data.weather[0].description
        this.icon = data.weather[0].icon
        this.like = Math.floor(data.main.feels_like)
        this.humidity = data.main.humidity
        this.main = data.weather[0].main
        this.visibility = data.visibility / 1000
        this.wind = data.wind.speed
        this.min = Math.floor(data.main.temp_min)
        this.max = Math.ceil(data.main.temp_max)
        console.log('Weather Data:', data);
        this.getWeatherData(data.coord.lat, data.coord.lon)
      },
      error: (error) => {
        console.error('Error fetching weather data:', error);
      }
    })
  }

  select(c:any){
    this.query=c
    this.suggestedCities=[]
  }


}
