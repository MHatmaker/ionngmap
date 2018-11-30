import { Directive, Output, EventEmitter, ElementRef, OnDestroy } from '@angular/core';

/**
 * Generated class for the DomchangeDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[domchange]' // Attribute selector
})
export class DomchangeDirective implements OnDestroy {
  private changes: MutationObserver;

  @Output()
  public domChange = new EventEmitter();

  constructor(private elementRef: ElementRef) {
    const element = this.elementRef.nativeElement;

    this.changes = new MutationObserver((mutations: MutationRecord[]) => {
          mutations.forEach((mutation: MutationRecord) => this.domChange.emit(mutation));
        }
    );

    this.changes.observe(element, {
      attributes: true,
      childList: true,
      characterData: true,
      subtree: true
    });
  }
  ngOnDestroy(): void {
    this.changes.disconnect();
  }
}
