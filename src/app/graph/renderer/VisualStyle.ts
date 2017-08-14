import { AofSample } from '../../audio/AofSample';

const HIGHLIGHT_CLASS = 'highlighted'
    , UNHIGHLIGHT_CLASS = 'unhighlighted';

const HOVER_CLASS = 'hovered';

export function highlightElement(element) {
    element.removeClass(UNHIGHLIGHT_CLASS);
    element.addClass(HIGHLIGHT_CLASS);
}

export function hoverElement(element) {
    element.addClass(HOVER_CLASS);
}

export function unhoverElement(element) {
    element.removeClass(HOVER_CLASS);
}

export function unhighlightElement(element) {
    element.removeClass(HIGHLIGHT_CLASS);
    element.addClass(UNHIGHLIGHT_CLASS);
}

export function resetElement(element) {
    const sample = element.scratch('sample');

    element.classes(sample.type);
}

const BEAT_COLOR = '#6E2435'
    , ELEMENT_COLOR = '#6E2435'
    , BASS_COLOR = '#947C7C'
    , SPEECH_COLOR = '#BE4058'
    , TEXTURE_COLOR = '#2D0311';

const BEAT_SIZE = 100;
const ELEMENT_SIZE = 60;
const BASS_SIZE = 80;
const SPEECH_SIZE = 40;
const TEXTURE_SIZE = 50;

export const VisualStyle = [
    {
        selector: 'node',
        style: {
            'font-family': 'Raleway, sans-serif',
            'text-valign': 'top',
            'text-halign': 'center',
            'min-zoomed-font-size': 4,
            'transition-property': [
                'background-blacken',
                'background-color',
                'background-opacity',
                'line-color',
                'width',
                'height'
            ].join(','),
            'transition-duration': '0.5s'
        }
    }, {
        selector: 'node.beat',
        style: {
            'height': BEAT_SIZE,
            'width': BEAT_SIZE,
            'background-color': BEAT_COLOR,
            'label': 'Beat'
        }
    }, {
        selector: 'node.element',
        style: {
            'height': ELEMENT_SIZE,
            'width': ELEMENT_SIZE,
            'background-color': ELEMENT_COLOR,
            'label': 'Element'
        }
    }, {
        selector: 'node.bass',
        style: {
            'height': BASS_SIZE,
            'width': BASS_SIZE,
            'background-color': BASS_COLOR,
            'label': 'Bass'
        }
    }, {
        selector: 'node.speech',
        style: {
            'height': SPEECH_SIZE,
            'width': SPEECH_SIZE,
            'background-color': SPEECH_COLOR,
            'label': 'Speech'
        }
    }, {
        selector: 'node.texture',
        style: {
            'height': TEXTURE_SIZE,
            'width': TEXTURE_SIZE,
            'background-color': TEXTURE_COLOR,
            'label': 'Texture'
        }
    }, {
        selector: 'node.unhighlighted',
        style: {
            'border-width': '2px',
            'border-style': 'solid',
            'border-color': '#888',
            'line-color': '#FFF',
            'background-opacity': 0,
            'label': ''
        }
    },
    {
        selector: 'node.highlighted',
        style: {
            'height': 1,
            'width': 1,
            'label': '',
            'background-opacity': 0
        }
    },
    {
        selector: 'edge',
        style: {
            'width': 3,
            'opacity': 0.5,
            'line-color': '#888',
            'curve-style': 'haystack'
        }
    }, {
        selector: 'node.hovered',
        style: {
            'background-opacity': 1,
            'background-blacken': -0.7,
            'transition-duration': '0.25s',
            'border-color': 'black',
            'border-width': '1px',
            'border-style': 'solid',
            'text-valign': 'center',
            label: elem => (elem.scratch('sample') as AofSample).sampleName
        }
    }, {
        selector: 'node.beat.unhighlighted.hovered',
        style: {
            'height': BEAT_SIZE,
            'width': BEAT_SIZE,
            'background-color': BEAT_COLOR
        }
    }, {
        selector: 'node.element.unhighlighted.hovered',
        style: {
            'height': ELEMENT_SIZE,
            'width': ELEMENT_SIZE,
            'background-color': ELEMENT_COLOR
        }
    }, {
        selector: 'node.bass.unhighlighted.hovered',
        style: {
            'height': BASS_SIZE,
            'width': BASS_SIZE,
            'background-color': BASS_COLOR
        }
    }, {
        selector: 'node.speech.unhighlighted.hovered',
        style: {
            'height': SPEECH_SIZE,
            'width': SPEECH_SIZE,
            'background-color': SPEECH_COLOR
        }
    }, {
        selector: 'node.texture.unhighlighted.hovered',
        style: {
            'height': TEXTURE_SIZE,
            'width': TEXTURE_SIZE,
            'background-color': TEXTURE_COLOR
        }
    }
];
