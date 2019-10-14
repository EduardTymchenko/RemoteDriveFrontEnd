import { Directive, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
  selector: '[appClickOutside]'
})
export class ClickOutsideDirective {

  constructor() { }
  private wasInside:boolean = true ;

  @Output() appClickOutside: EventEmitter<boolean> = new EventEmitter<boolean>();

  @HostListener('click') inClick() {
    this.wasInside = true;

   }

 @HostListener('document:click') onClick() {
  if (!this.wasInside) {
    this.appClickOutside.emit(false); 
  }
  this.wasInside = false;
 }
 @HostListener('document:contextmenu') onRightClick() {
  this.wasInside = false;
 }
 
}
