import React from 'react';
import { useRouteMatch } from "react-router-dom";
import './visualizer-group.scss';

import { SiteMap } from 'utils';
import { default as VisualizerType } from './visualizer-type';

export const VisualizerGroup = (props) => {
    let match = useRouteMatch({
        path: `/${props.group}/:visualizerType`
    });
    return (
            match
                ? <VisualizerType group={props.group} type={match.params.visualizerType} />
                : <div className="visualizer-group">
                    {SiteMap.filter(group => group.link === props.group)[0].types.map( (type) => {
                        return (
                                <VisualizerType key={type.link} group={props.group} type={type.link} />
                            );
                    })}
                </div>
        );
}
