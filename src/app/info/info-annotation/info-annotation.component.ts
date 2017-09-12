import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
               selector: 'info-annotation',
               template: `<sup class="annotation"
                               (mouseenter)="onToggle.next()"
                               (mouseleave)="onToggle.next()">[{{idx}}]</sup>`,
               styles: ['.annotation { cursor: pointer; font-weight: 600; }']
           })
export class InfoAnnotationComponent {
    @Input()
    idx: number = 0;
    @Output()
    onToggle = new EventEmitter<void>();

    constructor() {
    }
}
