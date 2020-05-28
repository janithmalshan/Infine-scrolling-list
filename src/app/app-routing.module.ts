import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {ListComponent} from './list/list.component';
import {DetailComponent} from './detail/detail.component';


const routes: Routes = [
  {path: '', component: ListComponent},
  {path: 'detail/:id', component: DetailComponent}
];

RouterModule.forRoot(routes, {scrollPositionRestoration: 'disabled'})
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule {
}
