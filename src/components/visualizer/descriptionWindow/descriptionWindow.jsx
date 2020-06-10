import React, { useRef, useEffect } from 'react';
import { useRouteMatch } from "react-router-dom";
import './descriptionWindow.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SiteMap } from 'utils';

const DescriptionWindow = React.forwardRef((props, ref) => {
    let { closeDescriptionDisplay } = props;
    const containerRef = useRef(null);
    useEffect(() => {
        const documentClickHandler = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                closeDescriptionDisplay();
                event.preventDefault();
            }
        }
        const escapeKeyHandler = (event) => {
            if (event.key === "Escape") {
                closeDescriptionDisplay();
                event.preventDefault();
            }
        };
        document.addEventListener("click", documentClickHandler);
        document.addEventListener("keydown", escapeKeyHandler);
        return () => {
            document.removeEventListener("click", documentClickHandler);
            document.removeEventListener("keydown", escapeKeyHandler);
        }
    }, [closeDescriptionDisplay]);
    let match = useRouteMatch({
        path: `/:visualizerGroup/:visualizerType/:visualizerClass`
    });

    let visualizerClass = SiteMap.filter(group => group.link === match.params.visualizerGroup)[0]
            .types.filter(type => type.link === match.params.visualizerType)[0]
            .classes.filter(visualizer => visualizer.link === match.params.visualizerClass)[0];

    return (
            <div className="description-window-container" ref={ref}>
                <div className="description-window" ref={containerRef}>
                    <FontAwesomeIcon id="exit-description" icon={["far","times-circle"]} className="hoverable-icon" onClick={closeDescriptionDisplay} />
                    <p id="close-box-tip">(Click outside or press Esc. to close.)</p>
                    <h2 id="description-title">
                        {props.title.split("").map((char, i) => {
                            if (i > 0 && char === char.toUpperCase()) {
                                return (
                                    <span key={i}>
                                        <wbr />{char}
                                    </span>
                                );
                            }
                            return char;
                        })} Description
                    </h2>
                    <p className={`description-text`}>
                        {visualizerClass.description}
                    </p>
                </div>
            </div>
        );
});

export default DescriptionWindow;
