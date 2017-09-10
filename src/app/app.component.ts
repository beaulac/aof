import { Component, OnInit, ViewChild } from '@angular/core';
import { HowlerService } from './audio/howler.service';
import { fadeAnimation } from './fade.animation';
import { NodeService } from './graph/builder/node.service';
import { CyRendererComponent } from './graph/renderer/cy-renderer.component';

@Component({
               selector: 'app-root',
               animations: [fadeAnimation],
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

    toggleInfo(newInfo = !this.showInfo) {
        this.showInfo = newInfo;
        if (!this.showInfo) {
            // Graph does not re-appear if it was modified while info page was open
            // Unless it is manually resized... after next digest (haack)
            setTimeout(() => this.cyRenderer.resizeAndFit(), 0);
        }
    }

    stopAll() {
        this.cyRenderer.STOP();
        this.nodeService.stopAllSamples();
    }

    ngOnInit() {
        console.debug('Renderer: ', this.cyRenderer);
    }

    rebuildNodes() {
        this.stopAll();
        this.nodeService.selectSamples();
    }
}
