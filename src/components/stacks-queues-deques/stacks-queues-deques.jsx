import React from 'react';
import { Switch, Route, useRouteMatch, Link } from "react-router-dom";
import './stacks-queues-deques.scss';

import StackArrayVisualizer from './stack-array';
import QueueArrayVisualizer from './queue-array';
import DequeArrayVisualizer from './deque-array';
import StackLinkedListVisualizer from './stack-linked-list';
import QueueLinkedListVisualizer from './queue-linked-list';
import DequeLinkedListVisualizer from './deque-linked-list';

export default function StacksQueuesDeques(props) {
    let { path, url } = useRouteMatch();
    return (
            <Switch>
                <Route exact path={path} component={props => <StackQueueDequeView url={url} />} />
                <Route path={`${path}/stack-array`} component={StackArrayVisualizer} />
                <Route path={`${path}/queue-array`} component={QueueArrayVisualizer} />
                <Route path={`${path}/deque-array`} component={DequeArrayVisualizer} />
                <Route path={`${path}/stack-linkedlist`} component={StackLinkedListVisualizer} />
                <Route path={`${path}/queue-linkedlist`} component={QueueLinkedListVisualizer} />
                <Route path={`${path}/deque-linkedlist`} component={DequeLinkedListVisualizer} />
            </Switch>
        );
}

function StackQueueDequeView(props) {
    let path = props.url;
    return (
            <div className="list-view">
                <Link to={`${path}/stack-array`}>StackArray</Link>
                <Link to={`${path}/queue-array`}>QueueArray</Link>
                <Link to={`${path}/deque-array`}>DequeArray</Link>
                <Link to={`${path}/stack-linkedlist`}>StackLinkedList</Link>
                <Link to={`${path}/queue-linkedlist`}>QueueLinkedList</Link>
                <Link to={`${path}/deque-linkedlist`}>DequeLinkedList</Link>
            </div>
        );
}
