import { Directive, ElementRef, HostListener, EventEmitter, Output } from '@angular/core';

@Directive({
  selector: '[appMove]'
})
export class MoveDirective {

  constructor(private elementRef: ElementRef) { }
  @Output() show: EventEmitter<boolean> = new EventEmitter<boolean>();

  @HostListener('document:click', ['$event']) onClick(e: Event) {
    let ok: boolean = false;
    console.log(e.composedPath())
    // console.log(this.elementRef.nativeElement)
    e.composedPath().forEach(element => {
     if(document.getElementById("bt-create")===element) console.log("JJJJJ") ;
      if (element === this.elementRef.nativeElement || element === document.getElementById("btn-create")) {
        console.log('!!!!!');
        ok = true;
        // return;
      }
    });
    if(!ok){
      console.log('@@@@@@@@@@@');
      this.show.emit(false);
    } 
  }
}