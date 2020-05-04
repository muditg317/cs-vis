import React from 'react';
import { useRouteMatch } from "react-router-dom";
import './main.scss';

import { SiteMap } from 'utils';
import { default as VisualizerGroup } from 'components/visualizer-group';

export const Main = () => {
    let match = useRouteMatch({
        path: `/${SiteMap.visualizerParent}/:visualizerGroup`
    });
    // console.log("main",match,SiteMap.filter(section => section.type === "visualizer").map(group => group.link));
    return (
            match && SiteMap.filter(section => section.type === "visualizer").map(group => group.link).includes(match.params.visualizerGroup)
                ? <VisualizerGroup group={match.params.visualizerGroup} />
                : <div className="main">
                    {SiteMap.filter(section => section.type === "visualizer").map( (group) => {
                        return (
                                <VisualizerGroup key={group.link} group={group.link} />
                            );
                    })}
                </div>
        );
}
