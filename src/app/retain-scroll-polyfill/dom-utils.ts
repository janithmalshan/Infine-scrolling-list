const WINDOW_SELECTOR = '__window__';
const NG_ENCAPSULATION_PATTERN = /^_ng(host|content)\b/i;

export type Target = Window | Element;

/** Unified interface for scroll offsets across different types
 * of targets (elements vs. windows).
 */
export class DomUtils {

  /** Determine if the target at the given selector exists in the active DOM. */
  public exists(selector: string): boolean {

    return (!!this.select(selector));

  }

  /**  Get the scroll-top of the given target in the active DOM. */
  public getScrollTop(target: Target): number {

    if (target instanceof Window) {

      return (window.scrollY);

    } else {

      return (target.scrollTop);

    }

  }


  /**  Return the CSS selector for the given target. */
  public getSelector(target: Target): string | null {

    if (target instanceof Window) {

      return (WINDOW_SELECTOR);

    } else {

      return (this.getSelectorForElement(target));

    }

  }


  /**  Get the scrollable target for the given "scroll" event. */
  public getTargetFromScrollEvent(event: Event): Target | null {

    const node = event.target;

    if (node instanceof HTMLDocument) {

      return (window);

    } else if (node instanceof Element) {

      return (node);

    }

    return (null);

  }


  /**  Scroll the given target to the given scrollTop and
   * return the result value presented by the target.
   */
  public scrollTo(target: Target, scrollTop: number): number {

    if (target instanceof Window) {

      target.scrollTo(0, scrollTop);

      return (target.scrollY);

    } else if (target instanceof Element) {

      target.scrollTop = scrollTop;

      return (target.scrollTop);

    }

    return (0);

  }


  /** Return the target accessible at the given CSS selector. */
  public select(selector: string): Target | null {

    if (selector === WINDOW_SELECTOR) {

      return (window);

    } else {

      return (document.querySelector(selector));

    }

  }

  /** Generate a CSS selector for the given target. */
  private getSelectorForElement(target: Element): string | null {
    if (!document.body.contains(target)) {

      return (null);

    }

    const selectors: string[] = [];

    let current = target as Node | null;

    while (current && (current.nodeName !== 'BODY')) {

      let selector = current.nodeName.toLowerCase();

      for (const attribute of Array.from((current as Element).attributes)) {

        if (attribute.name.search(NG_ENCAPSULATION_PATTERN) === 0) {

          selector += `[${attribute.name}]`;

        }

      }

      selectors.unshift(selector);

      current = current.parentNode;

    }

    return (selectors.join(' > '));

  }


  /** Check the root scrollable node */
  private isRootScrollableNode(node: Node): boolean {

    return (node instanceof HTMLDocument);

  }

}
