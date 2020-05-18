import React, { useRef, useEffect } from 'react';
import { useRouteMatch } from "react-router-dom";
import './bigOWindow.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BigODisplay from 'components/big-o-type/big-o-display';

const BigOWindow = React.forwardRef((props, ref) => {
    let { closeBigODisplay } = props;
    const containerRef = useRef(null);
    useEffect(() => {
        const documentClickHandler = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                closeBigODisplay();
                event.preventDefault();
            }
        }
        const escapeKeyHandler = (event) => {
            if (event.key === "Escape") {
                closeBigODisplay();
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
    }, [closeBigODisplay]);
    let match = useRouteMatch({
        path: `/:visualizerGroup/:visualizerType/:visualizerClass`
    });


    return (
            <div className="big-o-window-container" ref={ref}>
                <div className="big-o-window" ref={containerRef}>
                    <FontAwesomeIcon id="exit-big-o" icon={["far","times-circle"]} className="hoverable-icon" onClick={closeBigODisplay} />
                    <p id="close-box-tip">(Click outside or press Esc. to close.)</p>
                    <h2 id="big-o-title">
                        {props.title.split("").map((char, i) => {
                            if (i > 0 && char === char.toUpperCase()) {
                                return (
                                    <span key={i}>
                                        <wbr />{char}
                                    </span>
                                );
                            }
                            return char;
                        })} Big-O
                    </h2>
                    <BigODisplay group={match.params.visualizerGroup} type={match.params.visualizerType} class={match.params.visualizerClass} title={props.title}/>
                </div>
            </div>
        );
});

export default BigOWindow;
