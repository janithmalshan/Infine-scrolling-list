import {Component, OnInit} from '@angular/core';
import {HttpService} from '../http.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  beers;
  notEmptyBeer = true;
  notscrolly = true;
  pageNumber = 1;

  // Create instance
  constructor(private httpService: HttpService) {
    this.getBeers();
  }

  ngOnInit() {
  }

  getBeers(): void {
    this.httpService.getBeerList().subscribe(data => {
      this.beers = data;
      console.log(this.beers);
    });
  }

  onScroll() {
    if (this.notscrolly && this.notEmptyBeer) {
      this.notscrolly = false;

      // Load next page on scrolling
      this.loadNext(this.pageNumber);
    }
  }

  loadNext(pageNumber) {
    // return last beer from the array
    /*const lastBeer = this.items[this.items.length - 1];
    // get id of last beer
    const lastBeerId = lastBeer.id;
    // sent this id as key value pare using formdata()
    const dataToSend = new FormData();
    dataToSend.append('id', lastBeerId);*/
    this.pageNumber = pageNumber + 1;
    // call http request
    this.httpService.getBeersNext(this.pageNumber, this.beers)
      .subscribe((data: any) => {
        const newBeer = data;
        if (newBeer.length === 0) {
          this.notEmptyBeer = false;
        }
        // add newly fetched beers to the existing beer
        this.beers = this.beers.concat(newBeer);
        this.notscrolly = true;
      });
  }

}
