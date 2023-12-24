import { Directive, Input } from '@angular/core';
import { MatSlideToggle } from '@angular/material/slide-toggle';

@Directive({
  selector: '[disableToogle]'
})
export class DisableToogleDirective {
  @Input() set disableToogle(value:boolean)
  {
        this.slide.toggleChange.closed=value
  }
  constructor(private slide:MatSlideToggle) { }
}