import {Component, OnInit} from '@angular/core';
import {HttpService} from '../http.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})

export class ListComponent implements OnInit {

  private beers;
  private pageNumber: number;

  constructor(private httpService: HttpService) {
  }

  public ngOnInit(): void {
    this.httpService.getBeerList().subscribe(data => {
      this.beers = data;
    });
    this.pageNumber = this.httpService.getPageNumber();
    if (this.pageNumber === undefined || null) {
      this.pageNumber = 2;
    }
  }

  onScroll() {
    this.loadNext(this.pageNumber);
  }

  /**
   * load Next BeerList
   * and if all beers are listed
   * call from the beginning
   * @param pageNumber current page number
   */
  loadNext(pageNumber) {
    this.pageNumber = pageNumber + 1;
    this.httpService.getBeersNext(this.pageNumber, this.beers)
      .subscribe((data: any) => {
        let newBeer = data;
        if (newBeer.length === 0) {
          this.pageNumber = 2;
          this.httpService.getBeerList().subscribe(oldData => {
            newBeer = oldData;
          });
        }
        this.beers = this.beers.concat(newBeer);
      });
  }
}
