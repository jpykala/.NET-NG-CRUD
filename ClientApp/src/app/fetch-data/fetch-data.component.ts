import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {MessageService} from 'primeng/api';
import { RestService } from 'restService';
import { forkJoin } from 'rxjs';

interface WeatherForecast {
  date: Date
  temperatureC: number
  temperatureF: number
  city: string
  wind: number
  rain: number
  id?: string
}

interface City {
  name: string
  id?: string
}

@Component({
  selector: 'app-fetch-data',
  templateUrl: './fetch-data.component.html',
  providers: [MessageService]
})
export class FetchDataComponent implements OnInit{
  forecasts: WeatherForecast[];

  cities: City[]
  selectedCity: City;

  newForecast: WeatherForecast;

  tempUnit: string = 'Celsius'

  date: Date
  inputTemp: number
  tempC: number
  tempF: number
  inputWind: number
  inputRain: number

  forecastsExists: Boolean = false 

  newCity: City
  newCityName: string;
  
  cols: any[]
  
  constructor(private restService: RestService, private messageService: MessageService, private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {
    this.cols = [
      { header: 'City' },
      { header: 'Date' },
      { header: 'Temp. (°C)' },
      { header: 'Temp. (F)' },
      { header: 'Wind (m/s)' },
      { header: 'Rain (mm)'},
      { header: ''}

    ];
  }
  ngOnInit(): void {
    forkJoin([
      this.getForecasts(),
      this.getCities()
    ]).subscribe(resp => {
      this.forecasts = resp[0]
      this.cities = resp[1]
      this.forecasts.forEach(element => {
        element.date = new Date(element.date)
      })
      console.log(this.forecasts)
      console.log(this.cities)
    }, error => console.error(error))
  }

  

  getForecasts(){
    return this.restService.getForecasts()
  }

  
  getCities(){
    return this.restService.getCities()
  }

  /**
   * @description
   * @param forecast is selected row data on table
   * converts temperature on table row celsius change
   */
  onCelsUpdate(forecast){
    forecast.temperatureF = this.calculateFarenheit(forecast.temperatureC)
  }

  /**
   * @description
   * @param forecast is selected row data on table
   * converts temperature on table farenheit change
   */
  onFarUpdate(forecast){
    forecast.temperatureC = this.calculateCelsius(forecast.temperatureF)
  }

  /**
   * @description 
   * converts @param farenheit to @returning value celsius  */
  calculateCelsius(farenheit){
    return (farenheit - 32) * 0.5556
  }

  /**
   * @description 
   * converts @param celsius to @returning value farenheit */
  calculateFarenheit(celsius){
      return (celsius * 1.8) + 32
  }

  createForecast(){
      if(this.tempUnit == 'Celsius'){
        this.tempC = this.inputTemp
        this.tempF = this.calculateFarenheit(this.inputTemp)
      }
      else{
        this.tempC = this.calculateCelsius(this.inputTemp)
        this.tempF = this.inputTemp
      }

      this.newForecast = {
        date: this.date,
        temperatureC: this.tempC,
        temperatureF: this.tempF,
        city: this.selectedCity.name,
        wind: this.inputWind,
        rain: this.inputRain,
      }
      
      this.restService.createForecast(this.newForecast).subscribe(resp => {
          resp.date = new Date(resp.date)
          this.forecasts.push(resp)
          this.showSuccess('Forecast saved succesfully')
          this.clearInputs();
      }, error => {
        this.showError('Error saving forecast')
        console.log(error)
      })

  }

  test(){
    console.log()
  }


  createCity(){

    this.newCity = {
      name: this.newCityName
    }

    this.restService.createCity(this.newCity).subscribe(resp => {
      this.cities.push(resp)
      this.showSuccess(this.newCity.name + ' added to cities')
    }, error => {
      this.showError('Error adding city')
      console.log(error)
    })
  }

  updateForecast(forecast){
    console.log(forecast)
    this.restService.updateForecast(forecast).subscribe(resp => {
      this.showSuccess('Forecast updated')
    }, error => {
      console.log(error)
      this.showError('Error on updating forecast')
    })
  }

  deleteForecast(forecast){
    console.log(forecast)
    this.restService.deleteForecast(forecast.id).subscribe(resp => {
      var index = this.forecasts.findIndex(e => e.id ==forecast.id)
      if(index !== -1) this.forecasts.splice(index, 1)
      this.showSuccess('Forecast deleted')
    }, error => {
      console.log(error)
      this.showError('Error on deleting forecast')
    })
  }

  deleteCity(city){
    this.restService.deleteCity(city.id).subscribe(resp => {
      this.showSuccess('City deleted')
    }, error => {
      console.log(error)
      this.showError('Error on deleting city')
    })
  }


  showSuccess(message) {
    this.messageService.add({severity:'success', summary: 'Success', detail: message});
  }
  showError(message){
    this.messageService.add({severity:'error', summary: 'Error', detail: message})
  }

  clearInputs(){
    this.selectedCity = undefined;
    this.inputTemp = null;
    this.date = undefined;
    this.inputWind = null;
    this.inputRain = null;
  }
}
 
/**
 * On city update set city name to forecast city
 * 
 * Delete city on open panel
 * 
 * DONutss !!
 * 
 */

