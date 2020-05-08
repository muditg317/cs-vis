import React, { useRef, useEffect } from 'react';
import './bigOWindow.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const BigOWindow = React.forwardRef((props, ref) => {
    let { closeBigODisplay } = props;
    const containerRef = useRef(null);

    useEffect(() => {
        const documentClickHandler = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                closeBigODisplay();
            }
        }
        document.addEventListener("click", documentClickHandler);
        console.log("open big o");
        return () => {
            document.removeEventListener("click", documentClickHandler);
            console.log("close big o");
        }
    }, [closeBigODisplay]);



    return (
            <div className="big-o-window-container" ref={ref}>
                <div className="big-o-window" ref={containerRef}>
                    <FontAwesomeIcon id="exit-big-o" icon={["far","times-circle"]} onClick={closeBigODisplay }/>
                </div>
            </div>
        );
});

export default BigOWindow;
