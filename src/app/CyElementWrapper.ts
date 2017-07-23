export abstract class CyElementWrapper {
    constructor(public id, public cyElement?) {
    }

    associateToCyElement(cyElement) {
        this.cyElement = cyElement;
    }

    abstract toCyElementJSON(): any
}
