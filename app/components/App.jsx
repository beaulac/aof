import React from 'react';
import SampleNodeGraph from './graph/SampleNodeGraph';


export default class App extends React.Component {

    render() {
        return (
            <div className="container">
                <div id="aof-title">A o F</div>
                <br />
                <div id="aof-subtitle">DATA RECOLLECTION</div>
                <SampleNodeGraph />
            </div>
        );
    }
}
