import {Event as NavigationEvent} from '@angular/router';
import {Inject} from '@angular/core';
import {Injectable} from '@angular/core';
import {InjectionToken} from '@angular/core';
import {NavigationEnd} from '@angular/router';
import {NavigationStart} from '@angular/router';
import {NgZone} from '@angular/core';
import {Router} from '@angular/router';

import {DomUtils} from './dom-utils';
import {Target} from './dom-utils';

export let OPTIONS_TOKEN = new InjectionToken<Options>('RetainScrollPolyfillService.Options');

export interface Options {
  pollDuration: number;
  pollCadence: number;
}

interface PageStates {
  [navigationID: number]: PageState;
}

interface PageState {
  [selector: string]: number;
}

@Injectable({
  providedIn: 'root'
})
export class RetainScrollPolyfillService {

  private applyStateToDomTimer: number;
  private currentPageState: PageState;
  private domUtils: DomUtils;
  private lastNavigationStartAt: number;
  private navigationIDs: number[];
  private pageStates: PageStates;
  private pollCadence: number;
  private pollDuration: number;
  private router: Router;
  private scrolledElements: Set<Target>;
  private zone: NgZone;

  // Initialize the polyfill service.
  constructor(
    domUtils: DomUtils,
    router: Router,
    zone: NgZone,
    @Inject(OPTIONS_TOKEN) options: Options
  ) {

    this.domUtils = domUtils;
    this.router = router;
    this.zone = zone;

    this.applyStateToDomTimer = 0;
    this.currentPageState = Object.create(null);
    this.lastNavigationStartAt = 0;
    this.navigationIDs = [];
    this.pageStates = Object.create(null);
    this.pollCadence = options.pollCadence;
    this.pollDuration = options.pollDuration;
    this.scrolledElements = new Set();

    this.setupScrollBinding();
    this.setupRouterBinding();

    // Disable the one scroll that is provided by the browser.
    if (window.history && window.history.scrollRestoration) {

      window.history.scrollRestoration = 'manual';

    }

  }

  /** Apply the given page-state to the rendered DOM.
   * poll the document until all states have been reinstated
   */
  private applyPageStateToDom(pageState: PageState): void {

    if (this.objectIsEmpty(pageState)) {

      return;

    }

    const pendingPageState = {...pageState};

    // Setup the scroll retention timer outside of the Angular Zone
    this.zone.runOutsideAngular(
      (): void => {

        const startedAt = Date.now();

        this.applyStateToDomTimer = window.setInterval(
          () => {

            for (const selector in pendingPageState) {

              const target = this.domUtils.select(selector);

              if (!target) {

                continue;

              }

              if (this.scrolledElements.has(target)) {

                delete (pendingPageState[selector]);

              } else {

                const scrollTop = pendingPageState[selector];
                const resultantScrollTop = this.domUtils.scrollTo(target, scrollTop);

                if (resultantScrollTop === scrollTop) {

                  delete (pendingPageState[selector]);

                }

              }

            }

            // If there are no more elements to scroll or, we've exceeded our
            // poll duration, then stop watching the DOM.
            if (
              this.objectIsEmpty(pendingPageState) ||
              ((Date.now() - startedAt) >= this.pollDuration)
            ) {

              clearTimeout(this.applyStateToDomTimer);

              if (this.objectIsEmpty(pendingPageState)) {
              }

            }

          },
          this.pollCadence
        );

      }
    );

  }


  // get the page state from the given set of nodes. This extracts the CSS selectors
  // and offsets from the recorded elements.
  private getPageStateFromNodes(nodes: Set<Target>): PageState {

    const pageState: PageState = Object.create(null);

    nodes.forEach(
      (target: Target) => {

        // Generate a CSS selector from the given target
        const selector = this.domUtils.getSelector(target);

        if (selector) {

          pageState[selector] = this.domUtils.getScrollTop(target);

        }

      }
    );

    return (pageState);

  }


  // I determine if the given object is empty (ie, has no keys).
  private objectIsEmpty(object: Object): boolean {

    for (const key in object) {

      return (false);

    }

    return (true);

  }


  // bind to the router events and perform to primary actions
  private setupRouterBinding(): void {

    let navigationID: number;
    let restoredNavigationID: number | null;

    const handleNavigationStart = (event: NavigationStart): void => {

      this.lastNavigationStartAt = Date.now();

      navigationID = event.id;
      restoredNavigationID = (event.restoredState)
        ? event.restoredState.navigationId
        : null
      ;

      clearTimeout(this.applyStateToDomTimer);

      Object.assign(
        this.currentPageState,
        this.getPageStateFromNodes(this.scrolledElements)
      );

      this.scrolledElements.clear();

      // tslint:disable-next-line:forin
      for (const selector in this.currentPageState) {
      }

    };

    // NavigationEnd event is to reinstate a cached page
    const handleNavigationEnd = (): void => {

      const previousPageState = this.currentPageState;

      this.currentPageState = this.pageStates[navigationID] = Object.create(null);
      if (!restoredNavigationID) {

        for (const selector in previousPageState) {

          const target = this.domUtils.select(selector);

          if (!target) {

            continue;

          }
          if (this.domUtils.getScrollTop(target) !== previousPageState[selector]) {

            continue;

          }

          this.currentPageState[selector] = previousPageState[selector];

        }

      } else if (restoredNavigationID && this.pageStates[restoredNavigationID]) {

        this.applyPageStateToDom(
          Object.assign(
            this.currentPageState,
            this.pageStates[restoredNavigationID]
          )
        );

      }

      this.navigationIDs.push(navigationID);

      while (this.navigationIDs.length > 20) {

        delete (this.pageStates[this.navigationIDs.shift() as number]);

      }

    };

    // Filter navigation event streams to the appropriate event handlers.
    this.router.events.subscribe(
      (event: NavigationEvent): void => {

        if (event instanceof NavigationStart) {

          handleNavigationStart(event);

        } else if (event instanceof NavigationEnd) {

          handleNavigationEnd();

        }

      }
    );

  }


  // bind to the scroll event and keep track of any elements that are scrolled
  private setupScrollBinding(): void {

    // Add scroll-binding outside of the Angular Zone
    this.zone.runOutsideAngular(
      (): void => {
        const scrollBufferWindow = 100;
        let target: Target | null;

        window.addEventListener(
          'scroll',
          (event: Event): void => {
            if ((Date.now() - this.lastNavigationStartAt) < scrollBufferWindow) {

              return;

            }

            if (target = this.domUtils.getTargetFromScrollEvent(event)) {

              this.scrolledElements.add(target);

            }

          },
          true
        );

      }
    );

  }

}
