import { Directive, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
  selector: '[appClickOutside]'
})
export class ClickOutsideDirective {

  constructor(private elementRef: ElementRef) { }
  private wasInside = false;

  @Output() show: EventEmitter<boolean> = new EventEmitter<boolean>();

  @HostListener('click') inClick() {
    this.wasInside = true;
    console.log('inside');
   }

 @HostListener('document:click') onClick() {
  if (!this.wasInside) {
     console.log('outside');
    this.show.emit(false); 
  }
  this.wasInside = false;
 }
}
