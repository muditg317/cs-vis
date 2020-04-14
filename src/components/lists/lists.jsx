import React from 'react';
import { Switch, Route, useRouteMatch } from "react-router-dom";
import './lists.scss';

import ArrayListVisualizer from './arraylist';
import SinglyLinkedListVisualizer from './singly-linked-list';

export default function Lists(props) {
    let { path, url } = useRouteMatch();
    return (
            <Switch>
                <Route exact path={path} component={props => <ListView url={url} />} />
                <Route path={`${path}/arraylist`} component={ArrayListVisualizer} />
                <Route path={`${path}/sll`} component={SinglyLinkedListVisualizer} />
            </Switch>
        );
}

function ListView(props) {
    return (
            <div className="list-view">
            </div>
        );
}
