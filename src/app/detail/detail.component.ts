import {Component, OnInit} from '@angular/core';
import {HttpService} from '../http.service';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  beer$: object;

  /**
   * Subscribe Single Beer Data
   */
  constructor(private httpService: HttpService, private route: ActivatedRoute,
              private location: Location) {
    this.route.params.subscribe(params => this.beer$ = params.id);
  }

  ngOnInit() {
    this.httpService.getBeer(this.beer$).subscribe(
      data => {
        this.beer$ = data[0];
      }
    );
  }

  /**
   * Back to the list
   */
  goBack(): void {
    this.location.back();
  }

}
