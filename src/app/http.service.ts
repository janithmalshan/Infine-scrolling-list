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
  getBeersNext() {
    return this.http.get('https://api.punkapi.com/v2/beers?page=2&per_page=10');
  }
  getBeer(beerId) {
    return this.http.get('https://api.punkapi.com/v2/beers/' + beerId);
  }
}
