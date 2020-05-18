import React, { useRef, useEffect } from 'react';
import { useRouteMatch } from "react-router-dom";
import './examplesWindow.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SiteMap } from 'utils';

const ExamplesDisplay = (props) => {
    let { example, callback } = props;
    return (
            <li className={`example-display`}>
                <p className={`example-text`}>{example.exampleText}</p>
                <button className={`example-try-it-button`} onClick={callback.bind(null,example.operationList,example.needsReset)}>{example.tryItText}</button>
            </li>
        );
}

const ExamplesWindow = React.forwardRef((props, ref) => {
    let { closeExamplesDisplay } = props;
    const containerRef = useRef(null);
    useEffect(() => {
        const documentClickHandler = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                closeExamplesDisplay();
                event.preventDefault();
            }
        }
        const escapeKeyHandler = (event) => {
            if (event.key === "Escape") {
                closeExamplesDisplay();
                event.preventDefault();
            }
        };
        document.addEventListener("click", documentClickHandler);
        document.addEventListener("keydown", escapeKeyHandler);
        // console.log("open big o");
        return () => {
            document.removeEventListener("click", documentClickHandler);
            document.removeEventListener("keydown", escapeKeyHandler);
            // console.log("close big o");
        }
    }, [closeExamplesDisplay]);
    let match = useRouteMatch({
        path: `/:visualizerGroup/:visualizerType/:visualizerClass`
    });

    let visualizerClass = SiteMap.filter(group => group.link === match.params.visualizerGroup)[0]
            .types.filter(type => type.link === match.params.visualizerType)[0]
            .classes.filter(visualizer => visualizer.link === match.params.visualizerClass)[0];

    let callback = (...exampleParams) => {
        closeExamplesDisplay(...exampleParams);
    };

    return (
            <div className="examples-window-container" ref={ref}>
                <div className="examples-window" ref={containerRef}>
                    <FontAwesomeIcon id="exit-examples" icon={["far","times-circle"]} className="hoverable-icon" onClick={closeExamplesDisplay} />
                    <p id="close-box-tip">(Click outside or press Esc. to close.)</p>
                    <h2 id="examples-title">
                        {props.title.split("").map((char, i) => {
                            if (i > 0 && char === char.toUpperCase()) {
                                return (
                                    <span key={i}>
                                        <wbr />{char}
                                    </span>
                                );
                            }
                            return char;
                        })} Examples
                    </h2>
                    <ul className={`examples-display-list`}>
                        {visualizerClass.examples.map((example,i) => {
                            return <ExamplesDisplay key={i} example={example} callback={callback} />
                        })}
                    </ul>
                </div>
            </div>
        );
});

export default ExamplesWindow;
