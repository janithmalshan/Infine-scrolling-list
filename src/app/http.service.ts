import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';

const BASE_URL = 'https://api.punkapi.com/v2/beers';
const CACHE_BEER_KEY = 'CACHE_BEER';
const CACHE_PAGE_NUMBER_KEY = 'CACHE_PAGE';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) {
  }

  public responseCache = new Map();

  /**
   * Get Initial Beer List
   */
  public getBeerList(): Observable<any> {
    const beersFromCache = this.responseCache.get(CACHE_BEER_KEY);
    if (beersFromCache) {
      return of(beersFromCache);
    }
    const response = this.http.get<any>(BASE_URL + '?page=1&per_page=20');
    response.subscribe(beers => this.responseCache.set(CACHE_BEER_KEY, beers));
    return response;
  }

  /**
   * Get Beer List according to pageNumber
   * @param pageNumber next pageNumber
   * @param items current beer List
   */
  getBeersNext(pageNumber, items) {
    const response = this.http.get(BASE_URL + '?page=' + pageNumber + '&per_page=10');
    response.subscribe(value => this.responseCache.set(CACHE_BEER_KEY, items));
    this.responseCache.set(CACHE_PAGE_NUMBER_KEY, pageNumber);
    return response;
  }

  /**
   * Get Beer details By Beer Id
   * @param beerId beer Id
   */
  getBeer(beerId) {
    return this.http.get(BASE_URL + '/' + beerId);
  }

  /**
   * Get cached PageNumber
   */
  getPageNumber() {
    return this.responseCache.get(CACHE_PAGE_NUMBER_KEY);
  }
}
