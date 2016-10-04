/**
 * Created by alacasse on 9/19/16.
 */
import React from 'react';
import SampleNode from 'components/graph/SampleNode';
import CyRenderer from 'components/graph/CyRenderer';
import {DEF_VISUAL_STYLE} from 'components/graph/VisualStyle';
import {DEF_SAMPLES} from 'components/graph/Samples';
import _ from 'lodash';

export default class SampleNodeGraph extends React.Component {
    static MIN_LEVEL = 0;

    static defaultProps = {
        style: {
            height: '100%',
            width: '100%'
        },
        renderOptions: {},
        networkData: {
            elements: []
        },
        visualStyle: DEF_VISUAL_STYLE
    };


    static buildElements() {
        let randomizedSamples = _.shuffle(DEF_SAMPLES);

        let currentRoot = SampleNodeGraph.buildRandomNode(randomizedSamples[0]);
        let elements = [currentRoot];
        for (var i = 1; i < randomizedSamples.length; i++) {
            let newNode = SampleNodeGraph.buildRandomNode(randomizedSamples[i]);

            currentRoot.connectTo(newNode, SampleNodeGraph.randomMultipleOfFourWeight());

            elements.push(newNode);

            if (Math.random() < 0.8) {
                currentRoot = newNode;
            }
        }

        return elements;
    }

    static buildRandomNode(sampleName) {
        return new SampleNode(sampleName, 10, 10);
    }

    static randomMultipleOfFourWeight() {
        return 4 + (4 * Math.floor(Math.random() * 3))  ;
    }

    render() {

        let elements = SampleNodeGraph.buildElements();

        return (
            <CyRenderer visualStyle={this.props.visualStyle} elements={elements}/>
        );

    }

}