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

const BEAT_COLOR = '#F2671F'
    , ELEMENT_COLOR = '#C91B26'
    , BASS_COLOR = '#9C0F5F'
    , SPEECH_COLOR = '#60047A'
    , TEXTURE_COLOR = '#160A47';

export const VisualStyle = [
    {
        selector: 'node',
        style: {
            'height': 30,
            'width': 30,
            'background-color': 'data(color)',
            'label': 'data(type)',
            'text-valign': 'center',
            'text-halign': 'left',
            'transition-property': 'background-color, background-blacken, background-opacity, line-color, target-arrow-color, width, height',
            'transition-duration': '0.5s'
        }
    }, {
        selector: 'node.beat',
        style: {
            'height': 100,
            'width': 100,
            'background-color': BEAT_COLOR,
            'label': 'Beat',
            'text-valign': 'center',
            'text-halign': 'left'
        }
    }, {
        selector: 'node.element',
        style: {
            'height': 60,
            'width': 60,
            'background-color': ELEMENT_COLOR,
            'label': 'Element',
            'text-valign': 'center',
            'text-halign': 'left'
        }
    }, {
        selector: 'node.bass',
        style: {
            'height': 80,
            'width': 80,
            'background-color': BASS_COLOR,
            'label': 'Bass',
            'text-valign': 'center',
            'text-halign': 'left'
        }
    }, {
        selector: 'node.speech',
        style: {
            'height': 40,
            'width': 40,
            'background-color': SPEECH_COLOR,
            'label': 'Speech',
            'text-valign': 'center',
            'text-halign': 'left'
        }
    }, {
        selector: 'node.texture',
        style: {
            'height': 50,
            'width': 50,
            'background-color': TEXTURE_COLOR,
            'label': 'Texture',
            'text-valign': 'center',
            'text-halign': 'left'
        }
    }, {
        selector: 'node.unhighlighted',
        style: {
            'background-opacity': 0,
            'label': '',
            'border-width': '2px',
            'border-style': 'solid',
            'border-color': '#888',
            'line-color': '#FFF',
            'target-arrow-color': '#FFF'
        }
    },
    {
        selector: 'node.highlighted',
        style: {
            'height': 1,
            'label': '',
            'width': 1,
            'background-color': '#333',
            'line-color': '#888',
            'target-arrow-color': '#888'
        }
    },
    {
        selector: 'edge',
        style: {
            'width': 3,
            'opacity': 0.666,
            'line-color': '#888',
            // 'label': 'data(length)',
            'curve-style': 'bezier',
            'control-point-step-size': 20,
            'control-point-distances': 50
        }
    },
    {
        selector: 'edge.bezier',
        style: {
            'curve-style': 'bezier',
            'control-point-step-size': 40
        }
    },
    {
        selector: 'edge.unbundled-bezier',
        style: {
            'curve-style': 'bezier',
            'control-point-distances': 120,
            'control-point-weights': 0.1
        }
    },
    {
        selector: 'edge.multi-unbundled-bezier',
        style: {
            'curve-style': 'unbundled-bezier',
            'control-point-distances': '40 -40',
            'control-point-weights': '0.25 0.75'
        }
    },
    {
        selector: 'edge.haystack',
        style: {
            'curve-style': 'haystack',
            'haystack-radius': 0.5
        }
    },
    {
        selector: 'edge.segments',
        style: {
            'curve-style': 'segments',
            'segment-distances': '40 -40',
            'segment-weights': '0.25 0.75'
        }
    }, {
        selector: 'node.hovered',
        style: {
            'background-opacity': 1,
            'background-blacken': -0.7,
            'transition-duration': '0.25s',
            'border-color': 'black',
            'border-width': '1px',
            'border-style': 'solid'
        }
    }, {
        selector: 'node.beat.unhighlighted.hovered',
        style: {
            'background-opacity': 1,
            'transition-duration': '0.25s',
            'height': 100,
            'width': 100,
            'background-color': BEAT_COLOR,
            'text-valign': 'center',
            'text-halign': 'left'
        }
    }, {
        selector: 'node.element.unhighlighted.hovered',
        style: {
            'height': 60,
            'width': 60,
            'background-color': ELEMENT_COLOR,
            'text-valign': 'center',
            'text-halign': 'left'
        }
    }, {
        selector: 'node.bass.unhighlighted.hovered',
        style: {
            'height': 80,
            'width': 80,
            'background-color': BASS_COLOR,
            'text-valign': 'center',
            'text-halign': 'left'
        }
    }, {
        selector: 'node.speech.unhighlighted.hovered',
        style: {
            'height': 40,
            'width': 40,
            'background-color': SPEECH_COLOR,
            'text-valign': 'center',
            'text-halign': 'left'
        }
    }, {
        selector: 'node.texture.unhighlighted.hovered',
        style: {
            'height': 50,
            'width': 50,
            'background-color': TEXTURE_COLOR,
            'text-valign': 'center',
            'text-halign': 'left'
        }
    }
];
