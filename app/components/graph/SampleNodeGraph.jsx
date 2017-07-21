/**
 * Created by alacasse on 9/19/16.
 */
import React from 'react';
import SampleNode from './SampleNode';
import CyRenderer from './CyRenderer';
import {DEF_VISUAL_STYLE} from './VisualStyle';
import {DEF_SAMPLES} from './Samples';
import _ from 'lodash';

export default class SampleNodeGraph extends React.Component {

    static PROBABILITY_TICK = 0.1;
    static BRANCHING_PROBABILITY = 0.9;
    static BUILD_FIXED = false;
    static TOTAL_NODE_COUNT = 25.0;
    static TYPE_RATIO_COUNT = 0;

    static types = {
        "Beat": 5.0,
        "Bass": 3.0,
        "Element": 10.0,
        "Speech": 5.0,
        "Texture": 10.0
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

    static fixedSamplesTree =
    {
        "A10_Speech.mp3": ["A14_Texture.mp3"],
        "A14_Texture.mp3": ["A2_Bass.mp3", "F4_Beat.mp3"],
        "A2_Bass.mp3": ["A10_Speech.mp3"],
        "F4_Beat.mp3": []
    };

    static buildFixedElements() {
        // Get list of provided samples
        var sampleNodes = [];
        for (let sample in SampleNodeGraph.fixedSamplesTree) {

            if (SampleNodeGraph.fixedSamplesTree.hasOwnProperty(sample)) {

                sampleNodes.push(SampleNodeGraph.buildRandomNode(sample));
            }
        }

        // Link all elements to their provided neighbors
        var samplesLength = sampleNodes.length;
        for (var i = 0; i < samplesLength; i++) {

            let neighbors = SampleNodeGraph.fixedSamplesTree[sampleNodes[i].filename];
            var neighborLength = neighbors.length;
            for (var j = 0; j < neighborLength; j++) {

                let newNeighbor = sampleNodes.find(function(element) {
                    return element.filename === neighbors[j];
                });

                if (newNeighbor) {

                    sampleNodes[i].connectTo(newNeighbor, SampleNodeGraph.randomMultipleOfFourWeight());
                }
            }
        }

        return sampleNodes;
    }

    static buildElements() {
        let samplesBytype = SampleNodeGraph.trimSamplesByType(SampleNodeGraph.samplesByType(DEF_SAMPLES));
        let sampleCount = SampleNodeGraph.countSamples(samplesBytype);

        // Init type probabilities
        var typeProbabilities = [];
        for (let type in SampleNodeGraph.types) {

            if (SampleNodeGraph.types.hasOwnProperty(type)) {

                let typeNodeCount = SampleNodeGraph.getTypeRatio(type) * SampleNodeGraph.TOTAL_NODE_COUNT;
                typeProbabilities[type] = typeNodeCount / sampleCount;
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

    static getTypeRatio(type) {

    	if (SampleNodeGraph.types.hasOwnProperty(type)) {

	    	if (SampleNodeGraph.TYPE_RATIO_COUNT == 0) {

		    	for (let type in SampleNodeGraph.types) {

		            SampleNodeGraph.TYPE_RATIO_COUNT += SampleNodeGraph.types[type];
		        }
		    }

		    return SampleNodeGraph.types[type] / SampleNodeGraph.TYPE_RATIO_COUNT;
		}

		return 0;

    }

    static trimSamplesByType(groupedMap) {

    	for (let type in SampleNodeGraph.types) {

            if (SampleNodeGraph.types.hasOwnProperty(type)) {

                groupedMap[type] = _.shuffle(groupedMap[type]);

                let count = groupedMap[type].length;
                let maxOfType = SampleNodeGraph.getTypeRatio(type) * SampleNodeGraph.TOTAL_NODE_COUNT;

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

        let elements = SampleNodeGraph.BUILD_FIXED ? SampleNodeGraph.buildFixedElements() : SampleNodeGraph.buildElements();

        return (
            <CyRenderer visualStyle={this.props.visualStyle} elements={elements}/>
        );

    }

}
