import React from 'react';
import './visualizer-title.scss';

import { Utils } from 'utils';

export const VisualizerTitle = (props) => {
    return (
            <div className="visualizer-title">
                <p className="title-text" onClick={() => {window.location.hash = `#/${props.group}/${props.type}/${props.link}`;}}>
                    {Utils.spannifyText(props.title,"CAPITALS")}
                </p>
            </div>
        );
}
