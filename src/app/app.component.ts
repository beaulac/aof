import { Component, OnInit, ViewChild } from '@angular/core';
import { CyRendererComponent } from './cy-renderer/cy-renderer.component';

@Component({
               selector: 'app-root',
               templateUrl: './app.component.html',
               styleUrls: ['./app.component.css']
           })
export class AppComponent implements OnInit {

    @ViewChild(CyRendererComponent)
    public cyRenderer: CyRendererComponent;

    someRange = 0;

    constructor() {
    }

    stopAll() {
        this.cyRenderer.STOP();
    }

    ngOnInit() {
        console.debug('Renderer: ', this.cyRenderer);
    }
}
