import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { fadeAnimation } from '../fade.animation';

@Component({
               selector: 'app-info',
               animations: [fadeAnimation],
               templateUrl: './info.component.html',
               styleUrls: ['./info.component.scss']
           })
export class InfoComponent implements OnInit {
    @Output()
    public rollOut = new EventEmitter();

    popoverShown = [false, false, false, false];

    metaPopoverShown = [false, false, false];

    constructor() {
    }

    ngOnInit() {
    }

    togglePopover(toggleIdx) {
        this.popoverShown = this.popoverShown.map((shown, idx) => (idx === toggleIdx) ? !shown : false);
    }

    showMetaPopover(toggleIdx) {
        this.metaPopoverShown[toggleIdx] = true;
    }

    hideMetaPopover(toggleIdx) {
        this.metaPopoverShown[toggleIdx] = false;
    }

    onMouseOut() {
        this.rollOut.next();
    }
}
