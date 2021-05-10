import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})

export class RestService {
  
  
  
  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }


  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }  

 
  getForecasts(): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'weatherforecast')
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  deleteAllCities(){
    return this.http.delete<any>(this.baseUrl + 'city', this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  deleteAllForecasts(){
    return this.http.delete<any>(this.baseUrl + 'weatherforecast', this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  

  getCities(): Observable<any> {
      return this.http.get<any>(this.baseUrl + 'city')
      .pipe(
          retry(1),
          catchError(this.handleError)
      )
  }

  createForecast(newForecast): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'weatherforecast', JSON.stringify(newForecast), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }  

  createCity(newCity): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'city', JSON.stringify(newCity), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }
  updateForecast(forecast): Observable<any>{
    return this.http.put<any>(this.baseUrl + 'weatherforecast/' + forecast.id, JSON.stringify(forecast), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  deleteForecast(id){
    return this.http.delete<any>(this.baseUrl + 'weatherforecast/' + id, this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  deleteCity(id){
    return this.http.delete<any>(this.baseUrl + 'city/' + id, this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  // Error handling 
  handleError(error) {
     let errorMessage = '';
     if(error.error instanceof ErrorEvent) {
       // Get client-side error
       errorMessage = error.error.message;
     } else {
       // Get server-side error
       errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
     }
     window.alert(errorMessage);
     return throwError(errorMessage);
  }

}