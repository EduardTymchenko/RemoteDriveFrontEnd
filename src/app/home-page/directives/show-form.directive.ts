import { Directive, ElementRef, Renderer2,  OnInit, TemplateRef, ViewContainerRef, Input } from '@angular/core';

@Directive({
  selector: '[appShowForm]'
})
export class ShowFormDirective {

  @Input() leftX: number;
  @Input() topY: number;

  constructor(private elementRef: ElementRef,  private renderer: Renderer2) { 
    // this.renderer.setStyle(this.elementRef.nativeElement, "position", "absolute");
    this.elementRef.nativeElement.style.position = "absolute";
    
    // this.elementRef.nativeElement.style.top = this.topY;
  }
OnInit(){
  this.elementRef.nativeElement.style.left = this.leftX;
}
    

}
