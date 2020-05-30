import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {ListComponent} from './list/list.component';
import {DetailComponent} from './detail/detail.component';


const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: '/list'},
  {path: 'list', component: ListComponent},
  {path: 'detail/:id', component: DetailComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})


export class AppRoutingModule {
}
