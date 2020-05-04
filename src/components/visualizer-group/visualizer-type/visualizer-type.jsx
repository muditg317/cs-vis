import React, { useEffect } from 'react';
import { useRouteMatch } from "react-router-dom";
import './visualizer-type.scss';

import { SiteMap } from 'utils';
import { default as VisualizerTitle } from './visualizer-title';

export const VisualizerType = (props) => {
    let match = useRouteMatch({
        path: `/${props.group}/${props.type}/:visualizerClass`
    });
    useEffect(() => {
        document.querySelector(".app-content").style["overflow-y"] = match || "scroll";
    });
    let type = SiteMap.filter(group => group.link === props.group)[0].types.filter(type => type.link === props.type)[0];
    let foundClass = match && type.visualizers.map(visualizer => visualizer.link).includes(match.params.visualizerClass);
    let VisualizerComponent = foundClass ? type.visualizers.filter(visualizer => visualizer.link === match.params.visualizerClass)[0].component : null;
    return (
            foundClass
                ? <VisualizerComponent />
                : <div className="visualizer-type">
                        <h4 className="visualizer-type-title">{type.title_text}</h4>
                        <div className="visualizer-title-container">
                            {type.visualizers.map( (visualizer) => {
                                return (
                                        <VisualizerTitle key={visualizer.link} group={props.group} type={props.type} title={visualizer.title_text} link={visualizer.link} />
                                    );
                            })}
                        </div>
                </div>
        );
}
