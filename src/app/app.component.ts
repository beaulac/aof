import { Component, OnInit, ViewChild } from '@angular/core';
import { HowlerService } from './audio/howler.service';
import { NodeService } from './graph/builder/node.service';
import { CyRendererComponent } from './graph/renderer/cy-renderer.component';

@Component({
               selector: 'app-root',
               templateUrl: './app.component.html',
               styleUrls: ['./app.component.scss']
           })
export class AppComponent implements OnInit {

    @ViewChild(CyRendererComponent)
    public cyRenderer: CyRendererComponent;

    public showInfo = false;

    public muted = false;

    constructor(public nodeService: NodeService,
                public howlerService: HowlerService) {
    }

    updateBranchingProbability($event) {
        return this.nodeService.updateProbability($event);
    }

    updateTotalNodeCount($event) {
        return this.nodeService.updateTotalNodeCount($event);
    }

    toggleMute() {
        this.muted = !this.muted;
        this.howlerService.mute(this.muted);
    }

    toggleInfo() {
        this.showInfo = !this.showInfo;
    }

    stopAll() {
        this.cyRenderer.STOP();
    }

    ngOnInit() {
        console.debug('Renderer: ', this.cyRenderer);
    }

    rebuildNodes() {
        this.stopAll();
        this.nodeService.rebuildElements();
    }
}
