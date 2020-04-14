import React from 'react';
import { Switch, Route, useRouteMatch, Link } from "react-router-dom";
import './lists.scss';

import ArrayListVisualizer from './arraylist';
import SinglyLinkedListVisualizer from './singly-linked-list';
import DoublyLinkedListVisualizer from './doubly-linked-list';
import CircularSinglyLinkedListVisualizer from './circular-singly-linked-list';

export default function Lists(props) {
    let { path, url } = useRouteMatch();
    return (
            <Switch>
                <Route exact path={path} component={props => <ListView url={url} />} />
                <Route path={`${path}/arraylist`} component={ArrayListVisualizer} />
                <Route path={`${path}/sll`} component={SinglyLinkedListVisualizer} />
                <Route path={`${path}/dll`} component={DoublyLinkedListVisualizer} />
                <Route path={`${path}/c-sll`} component={CircularSinglyLinkedListVisualizer} />
            </Switch>
        );
}

function ListView(props) {
    let path = props.url;
    return (
            <div className="list-view">
                <Link to={`${path}/arraylist`}>ArrayList</Link>
                <Link to={`${path}/sll`}>SinglyLinkedList</Link>
                <Link to={`${path}/dll`}>DoublyLinkedList</Link>
                <Link to={`${path}/c-sll`}>CircularSinglyLinkedList</Link>
            </div>
        );
}
