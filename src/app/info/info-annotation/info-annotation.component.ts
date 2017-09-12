import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
               selector: 'info-annotation',
               template: `<sup class="annotation"
                               (mouseenter)="mouseToggle.next()"
                               (mouseleave)="mouseToggle.next()">[{{number}}]</sup>`,
               styles: ['.annotation { cursor: pointer; font-weight: 600; }']
           })
export class InfoAnnotationComponent {
    @Input()
    number: number = 0;
    @Output()
    mouseToggle = new EventEmitter<void>();

    constructor() {
    }
}
