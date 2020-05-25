import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  // Dependency injection
  constructor(private http: HttpClient) { }

  // Get data from api
  getBeers() {
    return this.http.get('https://api.punkapi.com/v2/beers');
  }
}
