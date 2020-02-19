import React from 'react';
import { Switch, Route, useRouteMatch } from "react-router-dom";
import './datastructures.scss';

import Lists from '../lists';


export default function DataStructures() {
    let { path, url } = useRouteMatch();
    return (
            <Switch>
                <Route exact path={path} component={props => <DataStructureView url={url} />} />
                <Route path={`${path}/lists`} component={Lists} />
            </Switch>
        );
}

function DataStructureView(props) {
    return (
            <div className="datastructure-view">
            </div>
        );
}
