import { Component, OnInit } from '@angular/core';

@Component({
               selector: 'app-info',
               templateUrl: './info.component.html',
               styleUrls: ['./info.component.css']
           })
export class InfoComponent implements OnInit {

    popoverHidden = [true, true, true, true];

    constructor() {
    }

    ngOnInit() {
    }

    showPopover(toggleIdx) {
        this.popoverHidden = this.popoverHidden.map((hidden, idx) => !hidden || (idx !== toggleIdx));
    }
}
