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
  }, {
    selector: 'node.beat',
    style: {
      'height': 100,
      'width': 100,
      'background-color': '#F2671F',
      'label': 'BEAT!',
      'text-valign': 'center',
      'text-halign': 'left'
    }
  }, {
    selector: 'node.element',
    style: {
      'height': 60,
      'width': 60,
      'background-color': '#C91B26',
      'label': 'Element!',
      'text-valign': 'center',
      'text-halign': 'left'
    }
  }, {
    selector: 'node.bass',
    style: {
      'height': 80,
      'width': 80,
      'background-color': '#9C0F5F',
      'label': 'Bass!',
      'text-valign': 'center',
      'text-halign': 'left'
    }
  }, {
    selector: 'node.speech',
    style: {
      'height': 40,
      'width': 40,
      'background-color': '#60047A',
      'label': 'Speech!',
      'text-valign': 'center',
      'text-halign': 'left'
    }
  }, {
    selector: 'node.texture',
    style: {
      'height': 50,
      'width': 50,
      'background-color': '#160A47',
      'label': 'Texture!',
      'text-valign': 'center',
      'text-halign': 'left'
    }
  },
  {
    selector: 'node.highlighted',
    style: {
      'background-color': '#FFF',
      'line-color': '#FFF',
      'target-arrow-color': '#FFF',
      'transition-property': 'background-color, line-color, target-arrow-color, width, height',
      'transition-duration': '0.5s'
    }
  },
  {
    selector: 'node.unhighlighted',
    style: {
      'height': 1,
      'width': 1,
      'background-color': '#333',
      'line-color': '#888',
      'target-arrow-color': '#888',
      'transition-property': 'background-color, line-color, target-arrow-color, height, width',
      'transition-duration': '0.5s'
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
  }
];
