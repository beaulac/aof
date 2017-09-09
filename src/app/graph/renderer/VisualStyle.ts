import { AofSample } from '../../audio/AofSample';

const HIGHLIGHT_CLASS = 'highlighted'
    , UNHIGHLIGHT_CLASS = 'unhighlighted'
    , LOADING_CLASS = 'sampleLoading';

const HOVER_CLASS = 'hovered';

export function highlightElement(element) {
    element.removeClass(UNHIGHLIGHT_CLASS);
    element.removeClass(LOADING_CLASS);
    element.addClass(HIGHLIGHT_CLASS);
}

export function markLoadingElement(element) {
    const sample = element.scratch('sample')
        , isLoaded = () => sample.isLoaded;

    const startDimension = element.height()
        , pulseDimension = startDimension + 10;

    const animateLoad = () => {
        if (isLoaded()) {
            return;
        }

        element.animate({
                            style: {'height': pulseDimension, 'width': pulseDimension},
                            duration: 200,
                            queue: true,
                            complete: unanimateLoad
                        });
    };
    const unanimateLoad = () => {
        element.animate({
                            style: {'height': startDimension, 'width': startDimension},
                            duration: 200,
                            queue: true,
                            complete: animateLoad
                        });
    };

    animateLoad();
}

export function hoverElement(element) {
    (element.scratch('sample') as AofSample).load();
    element.addClass(HOVER_CLASS);
}

export function unhoverElement(element) {
    element.removeClass(HOVER_CLASS);
}

export function unhighlightElement(element) {
    element.addClass(UNHIGHLIGHT_CLASS);
    element.removeClass(HIGHLIGHT_CLASS);
}

export function resetElement(element) {
    const sample = element.scratch('sample');

    element.classes(sample.type);
}

const MAIN_COLOR = '#797979';
const TRIGGER_COLOR = '#e54490';
const ACTIVE_COLOR = '#28c6a3';

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
            'background-color': MAIN_COLOR,
            'text-valign': 'top',
            'text-halign': 'center',
            'min-zoomed-font-size': 4,
            'transition-property': [
                'background-blacken',
                'background-color',
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
            'label': 'Beat'
        }
    }, {
        selector: 'node.element',
        style: {
            'height': ELEMENT_SIZE,
            'width': ELEMENT_SIZE,
            'label': 'Element'
        }
    }, {
        selector: 'node.bass',
        style: {
            'height': BASS_SIZE,
            'width': BASS_SIZE,
            'label': 'Bass'
        }
    }, {
        selector: 'node.speech',
        style: {
            'height': SPEECH_SIZE,
            'width': SPEECH_SIZE,
            'label': 'Speech'
        }
    }, {
        selector: 'node.texture',
        style: {
            'height': TEXTURE_SIZE,
            'width': TEXTURE_SIZE,
            'label': 'Texture'
        }
    }, {
        selector: 'node.unhighlighted',
        style: {
            'border-width': '2px',
            'border-style': 'solid',
            'border-color': '#000',
            'background-color': '#E4E4E4',
            'label': ''
        }
    },
    {
        selector: 'node.highlighted',
        style: {
            'background-color': ACTIVE_COLOR
        }
    },
    {
        selector: 'node.initialTrigger',
        style: {
            'background-color': TRIGGER_COLOR
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
            'width': BEAT_SIZE
        }
    }, {
        selector: 'node.element.unhighlighted.hovered',
        style: {
            'height': ELEMENT_SIZE,
            'width': ELEMENT_SIZE
        }
    }, {
        selector: 'node.bass.unhighlighted.hovered',
        style: {
            'height': BASS_SIZE,
            'width': BASS_SIZE
        }
    }, {
        selector: 'node.speech.unhighlighted.hovered',
        style: {
            'height': SPEECH_SIZE,
            'width': SPEECH_SIZE
        }
    }, {
        selector: 'node.texture.unhighlighted.hovered',
        style: {
            'height': TEXTURE_SIZE,
            'width': TEXTURE_SIZE
        }
    }
];
