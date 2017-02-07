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
    static PROBABILITY_TICK = 0.1;

    static BRANCHING_PROBABILITY = 0.9;

    static types = {
        "Beat": 5,
        "Bass": 3,
        "Element": 10,
        "Speech": 5,
        "Texture": 10
    };

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
        let samplesBytype = SampleNodeGraph.trimSamplesByType(SampleNodeGraph.samplesByType(DEF_SAMPLES));
        let sampleCount = SampleNodeGraph.countSamples(samplesBytype);

        // Init type probabilities
        var typeProbabilities = [];
        for (let type in SampleNodeGraph.types) {

            if (SampleNodeGraph.types.hasOwnProperty(type)) {
               
                let maxOfType = SampleNodeGraph.types[type];
                typeProbabilities[type] = maxOfType / sampleCount;
            }
        }

        let currentRoot = SampleNodeGraph.buildRandomNode(SampleNodeGraph.randomSelection(samplesBytype, typeProbabilities));
        let elements = [currentRoot];
        
        for (let i = 1; i < sampleCount; i++) {

            let newNode = SampleNodeGraph.buildRandomNode(SampleNodeGraph.randomSelection(samplesBytype, typeProbabilities));

            currentRoot.connectTo(newNode, SampleNodeGraph.randomMultipleOfFourWeight());

            elements.push(newNode);

            if (Math.random() < SampleNodeGraph.BRANCHING_PROBABILITY) {
                currentRoot = newNode;
            }
        }

        return elements;
    }

    static samplesByType() {

        let regex = /_([^._\s]+)[\s.]+/;

        return _.groupBy(DEF_SAMPLES, function sampleType(sampleName) {
            return regex.exec(sampleName)[1];
        })
    }

    static trimSamplesByType(groupedMap) {
        
        for (let type in SampleNodeGraph.types) {

            if (SampleNodeGraph.types.hasOwnProperty(type)) {

                groupedMap[type] = _.shuffle(groupedMap[type]);

                let count = groupedMap[type].length;
                let maxOfType = SampleNodeGraph.types[type];

                while (count > maxOfType) {
                    groupedMap[type].pop()
                    --count;
                }

            }
        }

        console.log(groupedMap);
        return groupedMap;
    }

    static countSamples(groupedMap) {
        
        var count = 0;
        
        for (let type in SampleNodeGraph.types) {

            if (SampleNodeGraph.types.hasOwnProperty(type)) {
                count += groupedMap[type].length;
            }
        }

        return count;
    }

    static randomSelection(groupedMap, probabilities) {
        
        console.log(groupedMap);
        console.log(probabilities);


        var selectedType = SampleNodeGraph.selectRandomType(probabilities);
        var selectedNode = groupedMap[selectedType].pop();
        for (let type in SampleNodeGraph.types) {

            if (SampleNodeGraph.types.hasOwnProperty(type)) {

                if (groupedMap[type].length > 0) {
                    if (type == selectedType) {
                        probabilities[type] = 0.1; // TODO alex: Don't hardcode this
                    }

                    probabilities[type] += SampleNodeGraph.PROBABILITY_TICK;
                }
                else
                {
                    probabilities[type] = 0;
                }
            }
        }
 
        return selectedNode;
    }

    static selectRandomType(probabilities) {
        
        // Calculate total probability
        var totalProbability = 0;

        for (let type in SampleNodeGraph.types) {

            if (SampleNodeGraph.types.hasOwnProperty(type)) {
                totalProbability = totalProbability + probabilities[type];
            }
        }

        // Make random selection based on existing probailities
        var randNumber = Math.random() * totalProbability;
        for (let type in SampleNodeGraph.types) {

            if (SampleNodeGraph.types.hasOwnProperty(type)) {
                if (randNumber <= probabilities[type]) {
                    return type;
                }
                randNumber -= probabilities[type];
            }
        }
    }

    static buildRandomNode(sampleName) {
        return new SampleNode(sampleName, 10, 10);
    }

    static randomMultipleOfFourWeight() {
        return 4 + (4 * Math.floor(Math.random() * 3));
    }

    render() {

        let elements = SampleNodeGraph.buildElements();

        return (
            <CyRenderer visualStyle={this.props.visualStyle} elements={elements}/>
        );

    }

}