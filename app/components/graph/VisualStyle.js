/**
 * Created by alacasse on 9/21/16.
 */
export const DEF_VISUAL_STYLE = [
        {
            selector: 'node',
            style: {
                'height': 30,
                'width': 30,
                'background-color': 'scratch(color)',
                'label': 'scratch(type)',
                'text-valign': 'center',
                'text-halign': 'left'
            }
        },
        {
            selector: 'node.highlighted',
            style: {
                'background-color': '#61bffc',
                'line-color': '#61bffc',
                'target-arrow-color': '#61bffc',
                'transition-property': 'background-color, line-color, target-arrow-color',
                'transition-duration': '0.5s'
            }
        },
        {
            selector: 'node.unhighlighted',
            style: {
                'background-color': '#333',
                'line-color': '#888',
                'target-arrow-color': '#888',
                'transition-property': 'background-color, line-color, target-arrow-color',
                'transition-duration': '0.5s'
            }
        },
        {
            selector: 'edge',
            style: {
                'width': 3,
                'opacity': 0.666,
                'line-color': '#888',
                //'label': 'data(length)',
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
        }
    ]
    ;