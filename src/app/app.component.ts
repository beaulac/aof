import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { HowlerService } from './audio/howler.service';
import { NodeService } from './graph/builder/node.service';
import { CyRendererComponent } from './graph/renderer/cy-renderer.component';

@Component({
               selector: 'app-root',
               animations: [
                   trigger(
                       'enterAnimation', [
                           transition(':enter', [
                               style({opacity: 0}),
                               animate('250ms', style({opacity: 1}))
                           ]),
                           transition(':leave', [
                               style({opacity: 1}),
                               animate('250ms', style({opacity: 0}))
                           ])
                       ]
                   )
               ],
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
