import React from 'react';
import { Switch, Route, useRouteMatch } from "react-router-dom";
import './datastructures.scss';

import Lists from 'components/lists';
import StacksQueuesDeques from 'components/stacks-queues-deques';

export default function DataStructures() {
    let { path, url } = useRouteMatch();
    return (
            <Switch>
                <Route exact path={path} component={props => <DataStructureView url={url} />} />
                <Route path={`${path}/lists`} component={Lists} />
                <Route path={`${path}/stacks-queues-deques`} component={StacksQueuesDeques} />
            </Switch>
        );
}

function DataStructureView(props) {
    return (
            <div className="datastructure-view">
            </div>
        );
}
