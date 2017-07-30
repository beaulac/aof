import { Component, OnDestroy, OnInit } from '@angular/core';
import * as cytoscape from 'cytoscape';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { NodeService } from '../node.service';
import { SampleNode } from '../SampleNode';
import { TICK_LENGTH_MS } from '../Timing';
import { resetElement, VisualStyle } from '../VisualStyle';
import { CY_LAYOUT_OPTIONS } from './CyLayout';
import { SampleRun } from './SampleRun';


@Component({
               selector: 'app-cy-renderer',
               templateUrl: './cy-renderer.component.html',
               styleUrls: ['./cy-renderer.component.css']
           })
export class CyRendererComponent implements OnInit, OnDestroy {
    private cy: any;
    private CYTOSCAPE_TAG = 'cy';
    private cyContainer;
    private currentLayout: any;

    private elements: Observable<SampleNode[]>;
    private elementSub: Subscription;
    private sampleRun: SampleRun;

    private tickLength = TICK_LENGTH_MS;

    constructor(nodeService: NodeService) {
        this.elements = nodeService.trackNodes();
    }

    public STOP() {
        this.sampleRun.STOP();
        this.cy.elements().forEach(cyElem => {
            const sample = cyElem.scratch('sample');
            if (sample) {
                resetElement(cyElem);
                sample.stop();
            }
        });
    }

    ngOnInit() {
        this.cyContainer = document.getElementById(this.CYTOSCAPE_TAG);
        this.elementSub = this.elements.subscribe(newElements => {
            this.updateCyjs(newElements);
        });
    }

    ngOnDestroy() {
        this.elementSub && this.elementSub.unsubscribe();
        this.sampleRun && this.sampleRun.STOP();
    }

    private updateCyjs(elements) {
        console.log('* Cytoscape.js is rendering new network...');

        const cyElements = _(elements).map(e => e.toCyElementJSON()).flatten().value();
        console.debug('Elements: ', cyElements);

        this.cy = cytoscape({
                                boxSelectionEnabled: false,
                                container: this.cyContainer,
                                elements: cyElements,
                                style: VisualStyle
                            });
        this.initLayout();
        this.setupEventListeners();
    }

    private setupEventListeners() {
        this.cy.nodes().on('click', event => this.startSampleRunFrom(event.target));
        window.addEventListener('resize', () => this.cy.resize() && this.cy.fit());
    }

    private startSampleRunFrom(root) {
        const bfs = this.cy.elements().bfs({
                                               root,
                                               visit: () => {
                                               },
                                               directed: false
                                           });

        this.sampleRun = new SampleRun(bfs, this.tickLength);
        this.sampleRun.highlightNextElement(root);
    }

    private initLayout() {
        this.currentLayout = this.cy.makeLayout(CY_LAYOUT_OPTIONS);
        this.currentLayout.run();
    }
}
