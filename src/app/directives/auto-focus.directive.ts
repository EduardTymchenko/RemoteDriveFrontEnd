import { Directive, AfterContentInit, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[autoFocus]'
})
export class AutoFocusDirective implements AfterContentInit{

  constructor(private el: ElementRef) { }

  public ngAfterContentInit() {
    this.el.nativeElement.focus();
}

}
