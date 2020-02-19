import React from 'react';
import { Switch, Route, useRouteMatch } from "react-router-dom";
import './lists.scss';

import ArrayListVisualizer from './arraylist-visualizer';

export default function Lists() {
    let { path, url } = useRouteMatch();
    return (
            <Switch>
                <Route exact path={path} component={props => <ListView url={url} />} />
                <Route path={`${path}/arraylist`} component={ArrayListVisualizer} />
            </Switch>
        );
}

function ListView(props) {
    return (
            <div className="list-view">
            </div>
        );
}
