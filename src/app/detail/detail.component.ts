import {Component, OnInit} from '@angular/core';
import {HttpService} from '../http.service';
import {Observable} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  beer$: object;

  constructor(private httpService: HttpService, private route: ActivatedRoute,
              private location: Location) {
    this.route.params.subscribe(params => this.beer$ = params.id);
  }

  ngOnInit() {
    this.httpService.getBeer(this.beer$).subscribe(
      data => {
        this.beer$ = data[0];
        console.log(this.beer$);
      }
    );
  }

  goBack(): void {
    this.location.back();
  }

}
