import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { fadeAnimation } from '../fade.animation';

const toggleFn = toggleIdx => (shown, idx) => (toggleIdx === idx) ? !shown : false;

@Component({
    selector: 'app-info',
    animations: [fadeAnimation],
    templateUrl: './info.component.html',
    styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {
    @Output()
    public rollOut = new EventEmitter<void>();

    popoverShown = [false, false, false, false];
    footNoteShown = [false, false, false, false, false];


    constructor() {
    }

    ngOnInit() {
    }

    togglePopover(toggleIdx) {
        this.popoverShown = this.popoverShown.map(toggleFn(toggleIdx));
    }

    toggleFootnote(toggleIdx) {
        this.footNoteShown = this.footNoteShown.map(toggleFn(toggleIdx));
    }
}
