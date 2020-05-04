import React from 'react';
import { useRouteMatch } from "react-router-dom";
import './visualizer-group.scss';

import { SiteMap } from 'utils';
import { default as VisualizerType } from './visualizer-type';

export const VisualizerGroup = (props) => {
    let match = useRouteMatch({
        path: `/${SiteMap.visualizerParent}/${props.group}/:visualizerType`
    });
    // console.log("group",match,SiteMap.filter(group => group.link === props.group)[0].types.map(type => type.link));
    return (
            match && SiteMap.filter(group => group.link === props.group)[0].types.map(type => type.link).includes(match.params.visualizerType)
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
