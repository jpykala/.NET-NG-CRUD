import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {MessageService} from 'primeng/api';
import { RestService } from 'restService';
import { forkJoin, Observable } from 'rxjs';
import { filter, find } from 'rxjs/operators';

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

interface CityData{
  city: string
  data?: Array<number>
}

interface DataSet {
  label: string
  backgroundColor: string
  data?: Array<number>
}

interface ChartData {
  labels: Array<string>
  datasets?: Array<DataSet>
}

@Component({
  selector: 'app-fetch-data',
  templateUrl: './fetch-data.component.html',
  providers: [MessageService]
})
export class FetchDataComponent implements OnInit, OnDestroy{

  //List data from db
  forecasts: WeatherForecast[];
  cities: City[]

  //Models for statistic table
  chartData: ChartData
  dataSet: DataSet


  //Static settings for ui option values
  filterUuc: string
  tempUnit: string = 'Celsius'
  chartOptions: Object

  

  //Models for POST
  newCity: City
  selectedCity: City;
  newForecast: WeatherForecast;
  
  
  //Input values (ngModels)

  rangeDates: Date[]
  filterCity: string

  newCityName: string;
  
  date: Date
  inputTemp: number
  tempC: number
  tempF: number
  inputWind: number
  inputRain: number


  //Static data for ui
  cols: any[]
  uuc: any[]
  
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
    this.uuc = [
      { value: 'Celsius', property: 'temperatureC'},
      { value: 'Farenheit', property: 'temperatureF'},
      { value: 'Wind', property: 'wind'},
      { value: 'Rain', property: 'rain'}
    ]
    this.filterUuc = this.uuc[0].property

    this.chartOptions = {
        scales: {
            yAxes: [{
               ticks: {
                  beginAtZero: true,
               }
            }] 
        }  
    }
    
  
  }
  ngOnDestroy(): void {
  }



  ngOnInit(): void {
   forkJoin([
      this.getForecasts(),
      this.getCities()
    ]).subscribe(resp => {
      this.forecasts = resp[0]
      this.cities = resp[1]
      if(this.cities.length > 0){
        this.filterCity = this.cities[0].name
      }
      this.forecasts.forEach(element => {
        element.date = new Date(element.date)
      })
      console.log(this.forecasts)
      console.log(this.cities)
    }, error => {
      this.showError('Error loading data')
      console.error(error)
    })
  }

/**
 * Set data for chart model
 */
  setChartData(){
    var filteredByCity = new Array()
    var chartLabels = new Array()
    var dataSetData = new Array()
    //var colorList = new Array()
    console.log(this.filterCity)
    filteredByCity = this.forecasts.filter(f => f.city == this.filterCity)
    console.log(this.rangeDates)
    filteredByCity.forEach(a => {
      console.log(this.filterUuc, a[this.filterUuc])
      if(a.date > this.rangeDates[0] && a.date < this.rangeDates[1]){
          chartLabels.push(a.date)
          dataSetData.push(a[this.filterUuc])
          //colorList.push('#' + Math.floor(Math.random()*16777215).toString(16))
      }
    })
    this.dataSet = {
      label: this.filterCity,
      data: dataSetData,
      backgroundColor: '#218adb'
    }

    this.chartData = {
      labels: chartLabels,
      datasets: [
        this.dataSet
      ]
    }

  }


/**
 * Function for ForkJoin
 */
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

  createCity(){

    this.newCity = {
      name: this.newCityName
    }

    this.restService.createCity(this.newCity).subscribe(resp => {
      this.cities.push(resp)
      this.showSuccess(this.newCity.name + ' added to cities')
      this.clearCityInput()
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

/**
 * 
 * @description
 * Remove object from @param array where @param id matches object id in @param array
 * @returns @param array where matching object is removed 
 */
  removeAtIndex(array, id){
    var index = array.findIndex(element => element.id == id)
    if(index !== -1) array.splice(index, 1)
    return array
  }


  deleteForecast(forecast){
    console.log(forecast)

    this.restService.deleteForecast(forecast.id).subscribe(resp => {
      this.forecasts = this.removeAtIndex(this.forecasts, forecast.id)
      this.showSuccess('Forecast deleted')
    }, error => {
      console.log(error)
      this.showError('Error on deleting forecast')
    })
    
  }

  deleteCity(city){
    this.restService.deleteCity(city.id).subscribe(resp => {
      this.cities = this.removeAtIndex(this.cities, city.id)
      this.showSuccess('City deleted')
    }, error => {
      console.log(error)
      this.showError('Error on deleting city')
    })
    
  }

  deleteAllCities(){

    this.restService.deleteAllCities().subscribe(resp => {
      this.showSuccess("All cities deleted")
      this.cities = []
    },err => {
      this.showError("Error on deleting cities")
      console.log(err)
    })
  
  }

  deleteAllForecasts(){

    this.restService.deleteAllForecasts().subscribe(resp => {
      this.showSuccess("All forecasts deleted")
      this.forecasts = []
    }, err => {
      this.showError("Error on deleting forecasts")
      console.log(err)
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

  clearCityInput(){
    this.newCityName = ''
  }
}

 

