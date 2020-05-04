import React from 'react';
import './visualizer-title.scss';

export const VisualizerTitle = (props) => {
    return (
            <div className="visualizer-title" onClick={() => {window.location.hash = `#/${props.group}/${props.type}/${props.link}`;}}>
                <p className="title-text">{props.title}</p>
            </div>
        );
}
