import { Component, OnInit, ViewChild } from '@angular/core';
import { CyRendererComponent } from './cy-renderer/cy-renderer.component';
import { NodeService } from './node.service';

@Component({
               selector: 'app-root',
               templateUrl: './app.component.html',
               styleUrls: ['./app.component.css']
           })
export class AppComponent implements OnInit {

    @ViewChild(CyRendererComponent)
    public cyRenderer: CyRendererComponent;

    constructor(public nodeService: NodeService) {
    }

    updateBranchingProbability($event) {
        this.nodeService.updateProbability($event);
    }

    stopAll() {
        this.cyRenderer.STOP();
    }

    ngOnInit() {
        console.debug('Renderer: ', this.cyRenderer);
    }

    rebuildNodes() {
        this.nodeService.buildElements();
    }
}
