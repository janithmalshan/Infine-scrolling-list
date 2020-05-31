import {ModuleWithProviders} from '@angular/core';
import {NgModule} from '@angular/core';

import {DomUtils} from './dom-utils';
import {OPTIONS_TOKEN as ServiceOptionsToken} from './retain-scroll-polyfill.service';
import {RetainScrollPolyfillService} from './retain-scroll-polyfill.service';
import {RouterOutletDirective} from './router-outlet.directive';

interface ModuleOptions {
  pollDuration?: number;
  pollCadence?: number;
}

@NgModule({
  exports: [
    RouterOutletDirective
  ],
  declarations: [
    RouterOutletDirective
  ]
})
export class RetainScrollPolyfillModule {

  constructor(polyfillService: RetainScrollPolyfillService) {
  }

  // providers for the application.
  static forRoot(options: ModuleOptions = {}): ModuleWithProviders {

    return ({
      ngModule: RetainScrollPolyfillModule,
      providers: [
        DomUtils,
        RetainScrollPolyfillService,
        {
          provide: ServiceOptionsToken,
          useValue: {
            pollDuration: (options.pollDuration || 3000),
            pollCadence: (options.pollCadence || 50)
          }
        }
      ]
    });

  }

}
