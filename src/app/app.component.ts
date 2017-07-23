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

    constructor() {
    }

    ngOnInit() {
        console.debug('Renderer: ', this.cyRenderer);
    }
}
