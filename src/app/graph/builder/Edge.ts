import { CyElementWrapper } from './CyElementWrapper';

const DEFAULT_EDGE_WEIGHT = 1;

export class Edge extends CyElementWrapper {
    public group = 'edges';

    constructor(public source,
                public target,
                public length = DEFAULT_EDGE_WEIGHT) {
        super(Math.random().toString(36).substr(2));
    }

    toCyElementJSON(): any {
        return {
            data: this
        };
    }
}
