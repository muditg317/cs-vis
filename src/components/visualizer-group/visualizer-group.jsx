import React from 'react';
import { useRouteMatch } from "react-router-dom";
import { Helmet } from 'react-helmet';
import './visualizer-group.scss';

import { SiteMap } from 'utils';
import { default as VisualizerType } from './visualizer-type';

export const VisualizerGroup = (props) => {
    let groupMatch = useRouteMatch({
        path: `/${props.group}`
    });
    let fullVisualizerGroupMatch = useRouteMatch({
        path: `/${props.group}/:visualizerType`
    });
    const GROUP = SiteMap.filter(group => group.link === props.group)[0];
    return (
            fullVisualizerGroupMatch && SiteMap.filter(group => group.link === props.group)[0].types.map(type => type.link).includes(fullVisualizerGroupMatch.params.visualizerType)
                ? <VisualizerType group={props.group} type={fullVisualizerGroupMatch.params.visualizerType} />
                : <div className="visualizer-group">
                    {groupMatch &&
                        <Helmet>
                            <title>{GROUP.title_text} – CS-Vis</title>
                        </Helmet>
                    }
                    {SiteMap.filter(group => group.link === props.group)[0].types.map( (type) => {
                        return (
                                <VisualizerType key={type.link} group={props.group} type={type.link} />
                            );
                    })}
                </div>
        );
}
