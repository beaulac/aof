import { Component } from '@angular/core';
import { buildFixedElements } from './SampleNodeGraph';
import { NodeService } from './node.service';

@Component({
               selector: 'app-root',
               templateUrl: './app.component.html',
               styleUrls: ['./app.component.css']
           })
export class AppComponent {
    constructor() {
    }
}
