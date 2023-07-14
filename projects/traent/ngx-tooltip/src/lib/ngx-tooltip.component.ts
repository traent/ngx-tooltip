import { Component, Input, TemplateRef, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'ngx-t3-tooltip',
  templateUrl: './ngx-tooltip.component.html',
  styleUrls: ['./ngx-tooltip.component.scss'],
})
export class NgxT3TooltipComponent {
  @Input() text?: string;
  @Input() template?: TemplateRef<any>;

  @Output() readonly contentChanged = new EventEmitter<void>();
}
