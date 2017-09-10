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

    popoverHidden = [true, true, true, true];
    footNoteHidden = [true, true, true, true, true];

    constructor() {
    }

    ngOnInit() {
    }

    showPopover(toggleIdx) {
        this.popoverHidden = this.popoverHidden.map((hidden, idx) => !hidden || (idx !== toggleIdx));
    }

    showFootnote (toggleIdx) {
        this.footNoteHidden = this.footNoteHidden.map((hidden, idx) => !hidden || (idx !== toggleIdx));
    }

    onMouseOut() {
        this.rollOut.next();
    }
}
