import { Component } from '@angular/core';
import { buildFixedElements } from './SampleNodeGraph';

@Component({
               selector: 'app-root',
               templateUrl: './app.component.html',
               styleUrls: ['./app.component.css']
           })
export class AppComponent {
    elements = buildFixedElements();
}
