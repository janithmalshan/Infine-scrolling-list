import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of, Subject} from 'rxjs';

const URL = 'https://api.punkapi.com/v2/beers?page=1&per_page=20';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  // Dependency injection
  constructor(private http: HttpClient) {
  }

  public responseCache = new Map();

  // Get data from api
  public getBeerList(): Observable<any> {
    const beersFromCache = this.responseCache.get(URL);
    if (beersFromCache) {
      console.log('return from cache');
      return of(beersFromCache);
    }
    const response = this.http.get<any>(URL);
    response.subscribe(beers => this.responseCache.set(URL, beers));
    return response;
  }

  getBeersNext(pageNumber, items) {
    console.log('pagenumber: ' + pageNumber)
    const response = this.http.get('https://api.punkapi.com/v2/beers?page=' + pageNumber + '&per_page=10');
    response.subscribe(value => this.responseCache.set(URL, items))
    return response;
  }

  getBeer(beerId) {
    return this.http.get('https://api.punkapi.com/v2/beers/' + beerId);
  }
}
