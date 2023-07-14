import { ConnectedPosition, Overlay, OverlayPositionBuilder, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  ComponentRef,
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  EventEmitter,
  Output,
} from '@angular/core';
import { takeUntil, Subject } from 'rxjs';

import { NgxT3TooltipComponent } from './ngx-tooltip.component';

type TooltipMode = 'hover' | 'click' | 'custom';

const register = (registry: NgxT3TooltipDirective[], directive: NgxT3TooltipDirective) => registry.push(directive);

const unregister = (registry: NgxT3TooltipDirective[], directive: NgxT3TooltipDirective) => {
  const index = registry.indexOf(directive);
  if (index > -1) {
    registry.splice(index, 1);
  }
};

const closeAll = (registry: NgxT3TooltipDirective[]) => registry.forEach((directive) => directive.closeToolTip());

@Directive({
  selector: '[ngxT3Tooltip]',
  exportAs: 'ngxT3Tooltip',
})
export class NgxT3TooltipDirective implements OnInit, OnDestroy {

  static registry: NgxT3TooltipDirective[] = [];

  @Input('ngxT3Tooltip') text?: string;
  @Input() tooltipTemplate?: TemplateRef<any>;
  @Input() tooltipPosition?: Partial<ConnectedPosition>;
  @Input() tooltipActiveClasses: Array<string> = [];
  @Input() tooltipMode: TooltipMode = 'hover';
  @Input() tooltipCloseAll = true;
  @Input() tooltipPreventClose = false;
  @Input() id?: string;
  @Output() readonly dismiss = new EventEmitter<Event | void>();

  private readonly onDestroy$ = new Subject<void>();
  private _overlayRef?: OverlayRef;

  constructor(
    private readonly overlay: Overlay,
    private readonly overlayPositionBuilder: OverlayPositionBuilder,
    private readonly elementRef: ElementRef,
  ) { }

  ngOnInit(): void {
    this.createOverlay();
  }

  ngOnDestroy(): void {
    if (this._overlayRef) {
      this.removeCssActiveClasses();
      this._overlayRef.detach();
    }
    unregister(NgxT3TooltipDirective.registry, this);
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  @HostListener('click', ['$event'])
  onDocumentClick(): void {
    if (this.tooltipMode !== 'click') {
      return;
    }
    this.openTooltip();
  }

  @HostListener('keydown', ['$event'])
  onElementKeyDown(event: any) {
    switch (event.key) {
      case 'Enter': {
        this.openTooltip();
        event.stopPropagation();
        event.preventDefault();
      }
    }
  }

  /**
   * This method will show the tooltip by instantiating the McToolTipComponent and attaching to the overlay
   */
  @HostListener('mouseenter')
  enter(): void {
    if (this.tooltipMode === 'hover') {
      this.attachComponent();
    }
  }

  @HostListener('mouseleave')
  leave(): void {
    if (this.tooltipMode === 'hover') {
      this.closeToolTip();
    }
  }

  /**
   * This method will open the tooltip.
   * If a previous overlay is present, it's destroyed and recreated.
   */
  openTooltip(): void {
    if (this._overlayRef) {
      this.closeToolTip();
    }
    this.attachComponent();
  }

  /**
   * This method will close the tooltip by detaching the component from the overlay
   */
  closeToolTip(force?: boolean, event?: Event): void {
    if (this._overlayRef && (force || !this.tooltipPreventClose)) {
      this.removeCssActiveClasses();
      if (this._overlayRef.hasAttached()) {
        this._overlayRef.attachments();
        this._overlayRef.detach();
        this.dismiss.emit(event);
      }
    }
  }

  private attachComponent(): void {
    if (this.elementRef.nativeElement.disabled) {
      return;
    }
    if (this.tooltipCloseAll) {
      closeAll(NgxT3TooltipDirective.registry);
    }
    if (this._overlayRef && !this._overlayRef.hasAttached()) {
      const tooltipRef: ComponentRef<NgxT3TooltipComponent> = this._overlayRef.attach(new ComponentPortal(NgxT3TooltipComponent));
      tooltipRef.instance.text = this.text;
      tooltipRef.instance.template = this.tooltipTemplate;
      this.attachCssActiveClasses();
      tooltipRef.instance.contentChanged.pipe(takeUntil(this.onDestroy$))
        .subscribe(() => {
          if (this._overlayRef) {
            this._overlayRef.updatePosition();
          }
        });
    }
  }

  private attachCssActiveClasses(): void {
    const cssClass = this.elementRef.nativeElement.className;
    this.elementRef.nativeElement.className = `${cssClass} ${this.tooltipActiveClasses.join(' ')}`;
  }

  private removeCssActiveClasses(): void {
    const cssClass = this.elementRef.nativeElement.className;
    this.elementRef.nativeElement.className = cssClass.replace(this.tooltipActiveClasses.join(' '), '');
  }

  private createOverlay() {
    const positionStrategy = this.overlayPositionBuilder
      .flexibleConnectedTo(this.elementRef)
      .withPositions([{
        originX: 'center',
        originY: 'bottom',
        overlayX: 'center',
        overlayY: 'top',
        offsetY: 8,
        ...this.tooltipPosition,
      }]);

    this._overlayRef = this.overlay.create({ positionStrategy });
    register(NgxT3TooltipDirective.registry, this);
    this._overlayRef.outsidePointerEvents()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((event: Event) => {
        this.closeToolTip(undefined, event);
      });
    this._overlayRef.keydownEvents()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((keydownEvent) => {
        if (keydownEvent.code === 'Escape') {
          this.closeToolTip();
        }
      });

  }
}
