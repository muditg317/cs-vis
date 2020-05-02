import React from 'react';
import { useRouteMatch } from "react-router-dom";
import './main.scss';

import { SiteMap } from 'utils';
import { default as VisualizerGroup } from 'components/visualizer-group';

export const Main = () => {
    let match = useRouteMatch({
        path: "/:visualizerGroup"
    });
    return (
            match
                ? <VisualizerGroup group={match.params.visualizerGroup} />
                : <div className="main">
                    {SiteMap.slice(0,-1).map( (group) => {
                        return (
                                <VisualizerGroup group={group.link} />
                            );
                    })}
                </div>
        );
}
