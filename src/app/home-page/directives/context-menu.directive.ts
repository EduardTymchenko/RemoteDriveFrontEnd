import { Directive, TemplateRef, ViewContainerRef, Input, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appContextMenu]'
})
export class ContextMenuDirective {

  constructor(private templateRef: TemplateRef<any>, private eRef: ElementRef,
    private viewContainerRef: ViewContainerRef) { }

    @Input() set appContextMenu(showMenu: boolean) {
      // console.log(showMenu);
      if (showMenu) {
         this.viewContainerRef.createEmbeddedView(this.templateRef);
      }
      else {
         this.viewContainerRef.clear();
      };
    }
    // @HostListener('document:click',['$event'])
    // onClick(e: MouseEvent) {
    //   console.log(e)
    // }

    // @HostListener('document:click', ['$event']) onClick(e: MouseEvent) {
    //   console.log(this.elementRef.nativeElement);
    //   // console.log(e);
    //   console.log(e.target);
  
  
    //   if (!this.elementRef.nativeElement.contains(e.target)) {
    //     // Logic for click outside
    //     console.log('outside')
    //   } else {
    //     // Logic for click inside
    //     console.log('inside')
    //   }
    // }
    
}
