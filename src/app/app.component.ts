import { Component, OnInit, ViewChild } from '@angular/core';
import { CyRendererComponent } from './cy-renderer/cy-renderer.component';
import { HowlerService } from './howler.service';
import { NodeService } from './node.service';

@Component({
               selector: 'app-root',
               templateUrl: './app.component.html',
               styleUrls: ['./app.component.css']
           })
export class AppComponent implements OnInit {

    @ViewChild(CyRendererComponent)
    public cyRenderer: CyRendererComponent;

    public muted = false;

    constructor(public nodeService: NodeService,
                public howlerService: HowlerService) {
    }

    updateBranchingProbability($event) {
        return this.nodeService.updateProbability($event);
    }

    toggleMute() {
        this.muted = !this.muted;
        this.cyRenderer[this.muted ? 'highlightAll' : 'unhighlightAll']();
    }

    updateNodeCount($event) {
        console.log($event);
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
