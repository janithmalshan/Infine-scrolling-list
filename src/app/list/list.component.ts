import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  beers: object;

  // Create instance
  constructor(private httpService: HttpService) { }

  ngOnInit() {
    this.httpService.getBeers().subscribe(data => {
      this.beers = data;
      console.log(this.beers);
    });
  }

}
