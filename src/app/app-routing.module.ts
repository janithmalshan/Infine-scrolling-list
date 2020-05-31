import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { RetainScrollPolyfillModule } from './retain-scroll-polyfill/retain-scroll-polyfill.module';

import {ListComponent} from './list/list.component';
import {DetailComponent} from './detail/detail.component';


const routes: Routes = [
  {path: '', component: ListComponent},
  {path: 'detail/:id', component: DetailComponent}
];

@NgModule({
  imports: [RetainScrollPolyfillModule.forRoot({
    pollDuration: 3000,
    pollCadence: 50
  }), RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})


export class AppRoutingModule {
}
